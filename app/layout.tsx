import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advy",
  description: "Classifieds web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <header className="h-16 bg-header-bg border-b border-gray-200 flex items-center px-6 shrink-0">
          <Link href="/" className="text-2xl font-bold text-accent mr-8">
            Advy
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/templates" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Templates
            </Link>
            <Link href="/guide" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Guide
            </Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
