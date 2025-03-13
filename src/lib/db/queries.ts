import { user as userTable , creation as creationTable } from "@/lib/db/schema";

export function canAccess(
    user: typeof userTable.$inferSelect,
    creation: typeof creationTable.$inferSelect
){
    // TODO: Better implementation of canAccess
    // TODO: Resolve "canAccess" type hack
    return creation.isPublic || user.isAdmin || creation.userId === user.id || user.canAccess!.ids.includes(creation.id)
}