import { JWT, NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail } from "../db/queries";
import { AuthError } from "../common";
import { transmittedUser } from "../../../next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      console.log('\t\tSIGNIN CALLBACK')
      return true;
    },
    async jwt({ token, user }) {
      console.log('\t\tJWT CALLBACK')
      if (user?.email) {
        try {
          const record = await getUserByEmail(user.email!);
          token.user = record!;
          console.log("Populated:", token.user);
        } catch (error) {
          if (error instanceof AuthError) {
            return token;
          } else {
            throw error;
          }
        }
      }
      return token
    },

    async session({ session, token }) {
      console.log('\t\tSESSION CALLBACK')
      console.log("Called session");
      if (token.user) {
        session.user = token.user as transmittedUser;
      }
      return (async () => session)() 
    },
  },
};

export default authOptions;
