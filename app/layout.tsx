import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Issues",
  description: "A simple issue tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              The Solo Developer
            </Link>
            <div className="flex gap-1 text-sm">
              <Link href="/repositories" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-2 py-1 cursor-pointer">
                Repositories
              </Link>
              <Link href="/tickets" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-2 py-1 cursor-pointer">
                Tickets
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
