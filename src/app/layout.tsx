import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Silkscreen } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { webSiteSchema, organizationSchema } from "@/lib/structured-data";
import "./globals.css";

// Space Grotesk is a variable font: one self-hosted file covers every weight
// (400–700) used across body text and headings. Omitting `weight` keeps it
// variable instead of fetching a separate static file per weight. It backs both
// --font-geist-sans (body) and --font-brand (headings, aliased in globals.css),
// so it is the single critical-path font and stays preloaded.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Silkscreen is decorative (two small header buttons) and never the LCP element,
// so keep it off the critical path — it loads on demand, not preloaded.
const silkscreen = Silkscreen({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.riftcut.pro"),
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
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${silkscreen.variable} antialiased`}>
      <body suppressHydrationWarning>{children}</body>
      <JsonLd data={[webSiteSchema(), organizationSchema()]} />
      {/* afterInteractive (async, non-render-blocking) keeps the AdSense script
          reliably detectable for site review. Once approved, switching to
          strategy="lazyOnload" reclaims some LCP by loading it during idle. */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6905859223899384"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
