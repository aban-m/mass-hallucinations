import type { Metadata } from "next";
import { TRPCProvider } from "@/client";
import SessionProvider from "@/client/session";
import Link from "next/link";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Mass Hallucinations",
  description: "Create and share AI art",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" data-wgscriptallow="true">
      <body>
        <nav>
          <Link href="/login">Login</Link>
          <Link href="/logout">Logout</Link>
          <Link href="/">Homepage</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/api/auth/session">Session</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/gallery/mine">My gallery</Link>
          <br />
          <h1>Welcome to Mass Hall!</h1>
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
