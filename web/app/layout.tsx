import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const displayFont = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
  adjustFontFallback: false,
});

const bodyFont = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const uiFont = IBM_Plex_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Easy Tab",
  description: "A modular new-tab canvas experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${uiFont.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
