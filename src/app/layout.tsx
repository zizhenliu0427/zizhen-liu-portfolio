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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
        width: 1733,
        height: 907,
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
