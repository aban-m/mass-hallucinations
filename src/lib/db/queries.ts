import { user as userTable , creation as creationTable, userAccess as userAccessTable } from "@/lib/db/schema";
import { db } from ".";

export async function canAccess(
    user: typeof userTable.$inferSelect,
    creation: typeof creationTable.$inferSelect
){
    if (creation.isPublic || user.isAdmin || creation.userId === user.id) {
        return true;
    }
    // query the table
    const hasAccess = !!(await db.query.userAccess.findFirst({
        where: (ua, { eq, and }) => and(
            eq(ua.userId, user.id),
            eq(ua.creationId, creation.id)
        )
    }))

    return hasAccess;
}