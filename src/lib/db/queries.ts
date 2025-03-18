import {
  User,
  Creation,
  user as userTable,
  creation as creationTable,
  userAccess as userAccessTable,
} from "@/lib/db/schema";
import { db } from ".";
import { Column, eq, Table } from "drizzle-orm";
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
   getByUnique<Creation>(creationTable, creationTable.id, uuid)


export async function canAccess(user: TransmittedUser, creation: Creation) {
  if (creation.isPublic || user.isAdmin || creation.userId === user.id) {
    return true;
  }
  // query the table
  const hasAccess = !!(await db.query.userAccess.findFirst({
    where: (ua, { eq, and }) =>
      and(eq(ua.userId, user.id), eq(ua.creationId, creation.id)),
  }));

  return hasAccess;
}


export async function commitImage(userId: string, dto: dtos.CommitImageDto) {
  const user = await getUserByUUID(userId);
  if (user!.credit < serverPolicy.IMAGE_COST) {
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
