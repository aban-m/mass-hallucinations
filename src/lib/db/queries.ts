import {
  user as userTable,
  creation as creationTable,
  userAccess as userAccessTable,
} from "@/lib/db/schema";
import { db } from ".";
import { eq } from "drizzle-orm";
import { serverPolicy } from "../common/config";
import * as dtos from "@/lib/common/dtos";
import { randomUUID } from "crypto";
import { InsufficientCreditError } from "../common/errors";

export async function canAccess(
  user: typeof userTable.$inferSelect,
  creation: typeof creationTable.$inferSelect
) {
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

export async function getUserByEmail(email: string) {
  const userRecord = (
    await db.select().from(userTable).where(eq(userTable.email, email))
  )[0];
  return userRecord;
}

export async function getUserByUUID(uuid: string) {
  const userRecord = (
    await db.select().from(userTable).where(eq(userTable.id, uuid))
  )[0];
  return userRecord;
}

export async function commitImage(userId: string, dto: dtos.CommitImageDto) {
  const user = await getUserByUUID(userId);
  if (user.credit < serverPolicy.IMAGE_COST) {
    throw new InsufficientCreditError()
  }
  const out = await db.transaction(async (tx) => {
    const result = await tx
      .insert(creationTable)
      .values({
        ...dto,
        userId,
        id: randomUUID(),
      })
      .returning();
    
      const updatedRecords = await tx
       .update(userTable)
       .set({credit: user.credit - serverPolicy.IMAGE_COST})
       .where(eq(userTable.id, userId))
       .returning({ credit: userTable.credit })
      
      return updatedRecords[0].credit
  });

  return out
}

