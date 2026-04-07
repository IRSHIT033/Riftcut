import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Scissors,
  FileOutput,
  Merge,
  ImagePlus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Riftcut — Free Private File Toolkit | Background Remover, PDF Tools",
  description:
    "Free online toolkit: remove image backgrounds with AI, convert files to PDF, merge PDFs, and create PDFs from images. 100% private — all processing happens in your browser. No uploads, no servers, no sign up.",
  keywords: [
    "background remover",
    "remove background online",
    "free background remover",
    "image to pdf",
    "word to pdf",
    "merge pdf online",
    "combine pdf",
    "images to pdf",
    "file converter",
    "pdf tools",
    "AI background removal",
    "client-side processing",
    "private file tools",
    "no upload",
    "free online tools",
  ],
  alternates: {
    canonical: "https://riftcut.pro",
  },
  openGraph: {
    title: "Riftcut — Free Private File Toolkit | No Uploads, 100% Private",
    description:
      "Remove backgrounds, convert files, merge PDFs, and more. Everything runs in your browser — your files never leave your device.",
    siteName: "Riftcut",
    type: "website",
    locale: "en_US",
    url: "https://riftcut.pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riftcut — Free Private File Toolkit | No Uploads, 100% Private",
    description:
      "Remove backgrounds, convert files, merge PDFs — all in your browser. 100% private.",
  },
};

const TOOLS = [
  {
    title: "Background Remover",
    description: "AI-powered background removal that runs entirely in your browser. No uploads, no servers.",
    icon: Scissors,
    href: "/bg-remover",
    color: "#FF6B6B",
    tag: "AI POWERED",
  },
  {
    title: "File Converter",
    description: "Convert images to PDF, Word documents to PDF, and more. All processing happens locally.",
    icon: FileOutput,
    href: "/convert",
    color: "#FFDE59",
    tag: "MULTI-FORMAT",
  },
  {
    title: "Merge PDFs & Images",
    description: "Combine PDFs and images into one document. Mix file types, drag to reorder, preview before download.",
    icon: Merge,
    href: "/merge-pdf",
    color: "#4CC9F0",
    tag: "MIX & MERGE",
  },
  {
    title: "Add Images to PDF",
    description: "Place images anywhere on your PDF pages. Drag to position, resize visually, then download.",
    icon: ImagePlus,
    href: "/pdf-editor",
    color: "#FF914D",
    tag: "VISUAL EDITOR",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Riftcut",
            url: "https://riftcut.pro",
            description:
              "Free online file toolkit with AI background remover, file converter, PDF merger, and images to PDF. 100% private — all processing in your browser.",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "AI Background Removal",
              "Image to PDF Conversion",
              "Word to PDF Conversion",
              "PDF Merging",
              "Images to PDF",
              "Add Images to PDF",
              "PDF Image Editor",
              "Client-side Processing",
              "No File Uploads",
            ],
            browserRequirements:
              "Requires a modern browser with WebGPU or WebAssembly support",
          }),
        }}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header showAllTools={false} />

        {/* Hero */}
        <section className="w-full border-b-3 border-foreground bg-background">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-14 sm:py-24">
            <div className="text-center">
              <div className="inline-block mb-6">
                <span className="inline-block neo-btn bg-neo-green px-4 py-1.5 text-sm font-bold rotate-[-2deg]">
                  FREE & 100% PRIVATE
                </span>
              </div>

              <h1
                className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground mb-5 leading-[1.1]"
                style={{ fontFamily: "var(--font-brand), sans-serif" }}
              >
                Your All-In-One
                <br />
                <span className="inline-block bg-neo-yellow neo-border px-3 py-1 rotate-[1deg] mt-2">
                  File Toolkit
                </span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-foreground/60 max-w-2xl mx-auto mb-4">
                Remove backgrounds, convert files, merge PDFs, and more.
                Everything runs in your browser -- your files never leave your device.
              </p>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="w-full border-b-3 border-foreground bg-foreground text-background py-2.5 overflow-hidden" aria-hidden="true">
          <div className="animate-marquee whitespace-nowrap flex gap-8 text-sm font-bold">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-8">
                <span>NO SIGN UP</span>
                <span>*</span>
                <span>FREE FOREVER</span>
                <span>*</span>
                <span>WORKS OFFLINE</span>
                <span>*</span>
                <span>100% PRIVATE</span>
                <span>*</span>
                <span>NO WATERMARKS</span>
                <span>*</span>
                <span>UNLIMITED FILES</span>
                <span>*</span>
                <span>CLIENT-SIDE ONLY</span>
                <span>*</span>
                <span>NO SIGN UP</span>
                <span>*</span>
                <span>FREE FOREVER</span>
                <span>*</span>
                <span>WORKS OFFLINE</span>
                <span>*</span>
                <span>100% PRIVATE</span>
                <span>*</span>
                <span>NO WATERMARKS</span>
                <span>*</span>
                <span>UNLIMITED FILES</span>
                <span>*</span>
                <span>CLIENT-SIDE ONLY</span>
                <span>*</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <section className="w-full flex-1 bg-background">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center"
              style={{ fontFamily: "var(--font-brand), sans-serif" }}
            >
              Pick a Tool
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="neo-card p-6 sm:p-8 group transition-all duration-100 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_#1a1a1a]"
                  style={{ backgroundColor: tool.color }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white neo-border neo-shadow-sm flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-foreground" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold bg-foreground text-white px-2.5 py-1 neo-border">
                      {tool.tag}
                    </span>
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "var(--font-brand), sans-serif" }}
                  >
                    {tool.title}
                  </h3>
                  <p className="text-sm font-medium text-foreground/70">
                    {tool.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="neo-btn inline-flex items-center gap-2 bg-white text-foreground px-5 py-2.5 rounded-lg text-sm font-bold">
                      Open Tool
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO content for crawlers */}
        <section className="w-full border-t-3 border-foreground bg-background">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h2
              className="text-xl sm:text-2xl font-bold text-foreground mb-6"
              style={{ fontFamily: "var(--font-brand), sans-serif" }}
            >
              Why Riftcut?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-medium text-foreground/70">
              <div>
                <h3 className="font-bold text-foreground mb-2">100% Private</h3>
                <p>
                  Every tool runs entirely in your browser. Your files are never uploaded to any server.
                  No accounts, no tracking, no data collection.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Free Forever</h3>
                <p>
                  All tools are completely free with no limits. No watermarks on your files,
                  no daily caps, no premium tiers.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Works Offline</h3>
                <p>
                  Once loaded, Riftcut works without an internet connection.
                  Process sensitive documents without any network requests.
                </p>
              </div>
            </div>

            <div className="mt-10 text-sm font-medium text-foreground/50 space-y-3">
              <h3 className="font-bold text-foreground/70">Available Tools</h3>
              <nav aria-label="Tools navigation">
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <Link href="/bg-remover" className="neo-btn inline-block bg-white px-3 py-1.5 rounded text-xs font-bold text-foreground">
                      Background Remover
                    </Link>
                  </li>
                  <li>
                    <Link href="/convert" className="neo-btn inline-block bg-white px-3 py-1.5 rounded text-xs font-bold text-foreground">
                      File Converter
                    </Link>
                  </li>
                  <li>
                    <Link href="/merge-pdf" className="neo-btn inline-block bg-white px-3 py-1.5 rounded text-xs font-bold text-foreground">
                      Merge PDFs & Images
                    </Link>
                  </li>
                  <li>
                    <Link href="/pdf-editor" className="neo-btn inline-block bg-white px-3 py-1.5 rounded text-xs font-bold text-foreground">
                      Add Images to PDF
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
