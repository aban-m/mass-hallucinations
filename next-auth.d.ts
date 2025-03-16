import { user } from "@/lib/db/schema";
import { DefaultSession, DefaultJWT } from "next-auth";

type fullUser = typeof user.$inferSelect;
type transmittedUser = Omit<fullUser, "createdAt">      // TODO: Check

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: transmittedUser
  }
  interface JWT extends DefaultJWT {
    user: transmittedUser
  }
}