import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail } from "../db/queries";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      console.log("\t\tSIGNIN CALLBACK");
      return true;
    },
    async jwt({ token, user }) {
      console.log("\t\tJWT CALLBACK");
      return token;
    },

    async session({ session, token }) {
      console.log("\t\tSESSION CALLBACK");
      if (token.email && !session.user?.id) {
        session.user = await getUserByEmail(token.email);
        console.log("\t\t\tDB TRIP!");
      }
      return session;
    },
  },
};

export default authOptions;
