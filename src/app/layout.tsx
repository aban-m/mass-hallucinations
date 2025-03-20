import "./globals.css";
import type { Metadata } from "next";
import { TRPCProvider } from "@/client";
import SessionProvider from "@/client/session";
import Link from "next/link";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/lib/auth/auth-options";
import { DynamicNavigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Mass Hallucinations",
  description: "Create and share AI art",
};

async function Navbar({ session }: { session: Session | null }) {
  return (
    <nav>
      <DynamicNavigation />
      {session?.user ? (
        <>
          <Link href="/logout">Logout</Link>
          <br />
          <Link href="/studio">Studio</Link>
          <br />
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <br />
        </>
      )}
      <Link href="/gallery">Gallery</Link>
      <br />
      <br />
      <h1>Welcome to Mass Hall!</h1>
      {session?.user && <pre>Your ID: {session?.user.id}</pre>}
      <hr />
    </nav>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-wgscriptallow="true">
      <body>
        <Navbar session={session} />
        <TRPCProvider>
          <SessionProvider session={session}>
            <div className="p-5">
              <main>
                {children}
              </main>
            </div>
          </SessionProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
