import './globals.css'
import type { Metadata } from "next";
import { TRPCProvider } from "@/client";
import SessionProvider from "@/client/session";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/auth-options";
import { DynamicNavigation } from "@/components/navigation";


export const metadata: Metadata = {
  title: "Mass Hallucinations",
  description: "Create and share AI art",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-wgscriptallow="true">
      <body>
        <nav>
          <DynamicNavigation />
          {session?.user ? (
            <>
              <Link href="/logout">Logout</Link><br />
              <Link href="/studio">Studio</Link><br />
            </>
          ) : (
            <><Link href="/login">Login</Link><br /></>
          )}
          <Link href="/gallery">Gallery</Link><br />
          <br />
          <h1>Welcome to Mass Hall!</h1>
          {session?.user && <pre>Your ID: {session?.user.id}</pre>}
          <hr />
        </nav>
        <TRPCProvider>
          <SessionProvider session={session}>
            <main>{children}</main>
          </SessionProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
