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
    <html lang="en">
      <body>
        <nav>
          <Link href="/login">Login</Link>
          <Link href="/logout">Logout</Link>
          <Link href="/">Homepage</Link>
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
