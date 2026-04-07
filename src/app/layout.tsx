import type { Metadata } from "next";
import { Space_Grotesk, Silkscreen, Caveat } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const silkscreen = Silkscreen({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const spaceGroteskBrand = Space_Grotesk({
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
  metadataBase: new URL("https://riftcut.pro"),
  title: {
    default: "Riftcut — Free Private File Toolkit | No Uploads, 100% Private",
    template: "%s | Riftcut",
  },
  description:
    "Remove backgrounds, convert files, merge PDFs, and more. All processing happens in your browser. 100% private — your files never leave your device.",
  authors: [{ name: "Riftcut" }],
  creator: "Riftcut",
  publisher: "Riftcut",
  openGraph: {
    siteName: "Riftcut",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "uw_Muks1Ls41vTdc2B7KjZmTZIQuwRvthgvf_hdZ9dY",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${silkscreen.variable} ${spaceGroteskBrand.variable} ${caveat.variable} antialiased`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
