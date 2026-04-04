import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PdfMerger } from "@/components/pdf-merger";
import { ToolPageHeader } from "@/components/tool-page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Merger — Combine PDF Files Online | Riftcut",
  description:
    "Merge multiple PDF files into one document for free, entirely in your browser. Drag to reorder pages. No uploads, no servers, 100% private.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "merge pdf online",
    "pdf merger",
    "combine pdf files",
    "join pdf",
    "free pdf merger",
    "merge pdf free",
    "online pdf merge",
    "private pdf merger",
  ],
  alternates: {
    canonical: "https://riftcut.app/merge-pdf",
  },
  openGraph: {
    title: "Free PDF Merger — Combine PDFs Online | Riftcut",
    description: "Merge multiple PDFs into one in your browser. Drag to reorder. Free, private, no uploads.",
    url: "https://riftcut.app/merge-pdf",
  },
};

export default function MergePdfPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <ToolPageHeader
            title="Merge PDFs"
            description="Combine multiple PDF files into one document. Drag to reorder."
            tag="DRAG & DROP"
            tagColor="#4CC9F0"
          />
          <PdfMerger />
        </div>
      </main>
      <Footer />
    </div>
  );
}
