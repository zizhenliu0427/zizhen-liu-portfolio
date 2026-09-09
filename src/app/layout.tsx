import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
  /* The production origin is the default so Open Graph and canonical URLs are
     absolute even when the env var is unset; override it for a preview
     deployment or a custom domain. */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://zizhen-liu-portfolio.vercel.app",
  ),
  title: "Zizhen Liu (Lance) — Full-Stack Engineer",
  description:
    "Sydney-based full-stack engineer building complete products — React interfaces, data and AI backends, and GPU-level systems code.",
  keywords: [
    "Zizhen Liu",
    "Lance Liu",
    "Full-Stack Engineer",
    "React Developer",
    "TypeScript",
    "Python",
    "C++",
    "Sydney",
  ],
  authors: [{ name: "Zizhen Liu" }],
  creator: "Zizhen Liu",
  openGraph: {
    type: "website",
    locale: "en_AU",
    title: "Zizhen Liu — Full-Stack Engineer",
    description:
      "Complete products engineered in Sydney: React interfaces, data and AI backends, GPU-level systems code.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Zizhen Liu — Full-Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zizhen Liu — Full-Stack Engineer",
    description: "Interface to metal: web, AI and systems engineering.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030806",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
