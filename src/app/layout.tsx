import "./globals.css";
import type { Metadata } from "next";
import { TRPCProvider } from "@/client";
import SessionProvider from "@/client/session";
import Link from "next/link";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/lib/auth/auth-options";
import { DynamicNavigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mass Hallucinations",
  description: "Create and share AI art",
};

function NavbarComponent({ session }: { session: Session | null }) {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold tracking-wide">Mass Hall</h1>
      <div className="flex items-center gap-3">
        <DynamicNavigation />
        <Button asChild variant="ghost">
          <Link href="/gallery">Gallery</Link>
        </Button>
        {session?.user ? (
          <>
            <Button asChild variant="ghost">
              <Link href="/studio">Studio</Link>
            </Button>
            <Button asChild variant="destructive">
              <Link href="/logout">Logout</Link>
            </Button>
          </>
        ) : (
          <Button asChild variant="default">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
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
        <NavbarComponent session={session} />
        <TRPCProvider>
          <SessionProvider session={session}>
            <div>
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
