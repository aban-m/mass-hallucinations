import {
  User,
  Creation,
  user as userTable,
  creation as creationTable,
  userAccess as userAccessTable,
} from "@/lib/db/schema";
import { db } from ".";
import { Column, eq, Table, and, desc, getTableColumns } from "drizzle-orm";
import { serverPolicy } from "../common/config";
import * as dtos from "@/lib/common/dtos";
import { randomUUID } from "crypto";
import { InsufficientCreditError } from "../common/errors";
import { TransmittedUser } from "../../../next-auth";

async function getByUnique<T>(
  table: Table,
  col: Column,
  val: any
): Promise<T | undefined> {
  const record = (
    (await db.select().from(table).where(eq(col, val)).limit(1)) as T[]
  )[0];
  return record;
}

export const getUserByEmail = async (email: string) =>
  getByUnique<User>(userTable, userTable.email, email);
export const getUserByUUID = async (uuid: string) =>
  getByUnique<User>(userTable, userTable.id, uuid);

export const getCreationByUUID = async (uuid: string) =>
  getByUnique<Creation>(creationTable, creationTable.id, uuid);

const userWithCreations = () =>
  db
    .select({
      user: {
        id: userTable.id,
        isAdmin: userTable.isAdmin,
        name: userTable.name,
        username: userTable.username,
      },
      creation: getTableColumns(creationTable),
    })
    .from(userTable)
    .leftJoin(creationTable, eq(creationTable.userId, userTable.id));

export async function getUserGallery(
  user: TransmittedUser | string | null,
  visitor: TransmittedUser | null
): Promise<dtos.UserGalleryDto | null> {
  const userId = typeof user === "object" ? (user as TransmittedUser).id : user;
  const queryResult = await userWithCreations().where(
    and(eq(userTable.id, userId))
  );

  const result = {
    user: queryResult[0].user as User,
    creations: queryResult.map((d) => d.creation) as Creation[],
  };
  return {
    user: result.user,
    creations: {
      data: result.creations,
      pagination: { count: result.creations.length },
    },
  };
}

export async function getPublicGallery(): Promise<dtos.GalleryDto> {
  const queryResult = await userWithCreations().where(
    eq(creationTable.isPublic, true)
  ).orderBy(desc(creationTable.createdAt));
  const result = queryResult.map((d) => ({...d, creation: d.creation!}))
  return { data: result, pagination: { count: queryResult.length } };
}

export async function canAccess(
  user: TransmittedUser | string | null,
  creation: Creation
) {
  const userId = typeof user === "object" ? (user as TransmittedUser).id : user;

  if (creation.isPublic || creation.userId === userId) {
    return true;
  }

  if (!userId) return false;

  // query the table

  const hasAccess = !!(await db.query.userAccess.findFirst({
    where: (ua, { eq, and }) =>
      and(eq(ua.userId, userId), eq(ua.creationId, creation.id)),
  }));

  return hasAccess;
}

export async function commitImage(userId: string, dto: dtos.CommitImageDto) {
  const user = await getUserByUUID(userId);
  if (user!.credit < serverPolicy.IMAGE_COST) {
    console.log('no credit')
    throw new InsufficientCreditError();
  }
  //const out = await db.transaction(async (tx) => {
  const result = await db
    .insert(creationTable)
    .values({
      ...dto,
      userId,
      id: randomUUID(),
    })
    .returning();

  const updatedRecords = await db
    .update(userTable)
    .set({ credit: user!.credit - serverPolicy.IMAGE_COST })
    .where(eq(userTable.id, userId))
    .returning({ credit: userTable.credit });

  return updatedRecords[0].credit;
  //});
}
