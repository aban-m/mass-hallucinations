import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const userRecord = await db
          .select()
          .from(user)
          .where(eq(user.email, session.user.email!));
        if (userRecord) {
          session.user.id = userRecord[0].id;
        }
      }
      return session;
    },
  },
};

export default authOptions;
