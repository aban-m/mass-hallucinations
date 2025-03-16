import {
  user as userTable,
  creation as creationTable,
  userAccess as userAccessTable,
} from "@/lib/db/schema";
import { db } from ".";
import { eq } from "drizzle-orm";

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

export async function getUserByEmail(
  email: string
): Promise<typeof userTable.$inferSelect | undefined> {
    const userRecord = (await db.select().from(userTable).where(eq(userTable.email, email)))[0]
    return userRecord
}
