import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Design a Bear Admin",
  description: "Admin dashboard for managing smart teddy bear commerce data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F4F7FF] text-[#1A1A2E]" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
