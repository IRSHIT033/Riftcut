import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PdfMerger } from "@/components/pdf-merger";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Merger — Combine PDFs & Images Into One | Riftcut",
  description:
    "Merge multiple PDF files and images into one document for free, entirely in your browser. Mix PDFs and images, drag to reorder, preview before download. No uploads, 100% private.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "merge pdf online",
    "pdf merger",
    "images to pdf",
    "add images to pdf",
    "combine pdf and images",
    "join pdf",
    "free pdf merger",
    "merge pdf free",
    "online pdf merge",
    "private pdf merger",
  ],
  alternates: {
    canonical: "https://www.riftcut.pro/merge-pdf",
  },
  openGraph: {
    title: "Free PDF & Image Merger | Riftcut",
    description: "Merge PDFs and images into one document. Drag to reorder, preview, download. Free and private.",
    url: "https://www.riftcut.pro/merge-pdf",
    siteName: "Riftcut",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF & Image Merger | Riftcut",
    description: "Merge PDFs and images into one document. Drag to reorder, preview, download. Free and private.",
  },
};

export default function MergePdfPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <PdfMerger />
        </div>
      </main>
      <Footer />
    </div>
  );
}
