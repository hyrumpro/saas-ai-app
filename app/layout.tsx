// app/layout.tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import QueryProvider from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex"
});

export const metadata: Metadata = {
  title: "AIFLY",
  description: "AI Powered",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
      </html>
  );
}
