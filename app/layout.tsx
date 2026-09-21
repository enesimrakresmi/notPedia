import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "WikiNot – AI-Powered Wikipedia Note Taker",
  description:
    "Wikipedia makalelerini Z.ai GLM-4.7-Flash yapay zekâsı ile anında özetleyin; kritik noktaları, anahtar kavramları ve çıkarımları Markdown formatında not alın.",
  keywords: [
    "Wikipedia",
    "Özet",
    "Yapay Zeka",
    "Not Çıkarıcı",
    "Z.ai",
    "GLM-4.7-Flash",
    "Markdown",
  ],
  authors: [{ name: "WikiNot" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-black text-neutral-100 selection:bg-neutral-800 selection:text-white">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
