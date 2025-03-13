import type { Metadata } from "next";
import TRPCProvider from "@/client"


export const metadata: Metadata = {
  title: "Mass Hallucinations",
  description: "Create and share AI art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
        {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
