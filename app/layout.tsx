import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cs-drill | CS Fundamentals MCQ Prep",
  description: "Fast-paced CS fundamentals MCQ prep tool for OS, Networks, DBMS, OOP, and DSA Theory.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "cs-drill",
  },
  applicationName: "cs-drill",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full min-h-dvh flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-zinc-800 selection:text-white overscroll-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
