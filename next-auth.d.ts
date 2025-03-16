import { user } from "@/lib/db/schema";
import { DefaultSession, DefaultJWT } from "next-auth";

type fullUser = typeof user.$inferSelect;
type TransmittedUser = Pick<fullUser, "email" | "isAdmin" | "name" | "id">      // TODO: Check

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: TransmittedUser
  }
  interface JWT extends DefaultJWT {
    user: TransmittedUser
  }
}