import type { Metadata } from "next";
import { Geist, Silkscreen, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700"],
});

const caveat = Caveat({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Riftcut — Remove Image Backgrounds Instantly",
  description:
    "Remove image backgrounds in seconds, entirely in your browser. 100% private — your images never leave your device. No uploads, no servers, no accounts required.",
  keywords: [
    "background remover",
    "remove background",
    "image editing",
    "AI background removal",
    "privacy",
    "client-side",
    "free",
    "no upload",
  ],
  authors: [{ name: "Riftcut" }],
  openGraph: {
    title: "Riftcut — Remove Image Backgrounds Instantly",
    description:
      "AI-powered background removal that runs entirely in your browser. Your images never leave your device.",
    siteName: "Riftcut",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riftcut — Remove Image Backgrounds Instantly",
    description:
      "AI-powered background removal that runs entirely in your browser.",
  },
  robots: { index: true, follow: true },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${silkscreen.variable} ${spaceGrotesk.variable} ${caveat.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
