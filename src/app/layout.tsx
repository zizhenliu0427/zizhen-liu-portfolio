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
  title: "Zizhen Liu (Lance) — Frontend Engineer",
  description:
    "Sydney-based frontend engineer building responsive React, TypeScript and data-rich product interfaces.",
  keywords: [
    "Zizhen Liu",
    "Lance Liu",
    "Frontend Engineer",
    "React Developer",
    "TypeScript",
    "Sydney",
  ],
  authors: [{ name: "Zizhen Liu" }],
  creator: "Zizhen Liu",
  openGraph: {
    type: "website",
    locale: "en_AU",
    title: "Zizhen Liu — Frontend Engineer",
    description:
      "Responsive React, TypeScript and data-rich product interfaces, engineered in Sydney.",
    images: [
      {
        url: "/og.png",
        width: 1733,
        height: 907,
        alt: "Zizhen Liu — Frontend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zizhen Liu — Frontend Engineer",
    description: "Frontend systems, data UI and interaction engineering.",
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
