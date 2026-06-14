import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PdfMerger } from "@/components/pdf-merger";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import {
  webApplicationSchema,
  breadcrumbSchema,
  type FaqItem,
} from "@/lib/structured-data";
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

const FAQS: FaqItem[] = [
  {
    question: "Can I merge PDFs and images together?",
    answer:
      "Yes. You can combine multiple PDF files and images (JPG, PNG, and more) into a single PDF document.",
  },
  {
    question: "Can I reorder pages before merging?",
    answer:
      "Yes. Drag files to reorder them and preview the result before downloading the merged PDF.",
  },
  {
    question: "Are my files uploaded anywhere?",
    answer:
      "No. Merging happens entirely in your browser. Your files never leave your device, keeping everything 100% private.",
  },
  {
    question: "Is the PDF merger free?",
    answer:
      "Yes, it is completely free with no watermarks, no limits, and no account required.",
  },
];

export default function MergePdfPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd
        data={[
          webApplicationSchema({
            name: "Free PDF Merger",
            path: "/merge-pdf",
            description:
              "Merge multiple PDF files and images into one document for free, entirely in your browser. Mix PDFs and images, drag to reorder, preview before download.",
            featureList: [
              "Merge Multiple PDFs",
              "Combine PDFs and Images",
              "Drag to Reorder",
              "Preview Before Download",
              "Client-side Processing",
            ],
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Merge PDFs & Images", path: "/merge-pdf" },
          ]),
        ]}
      />
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <PdfMerger />
        </div>
      </main>
      <FaqSection faqs={FAQS} />
      <Footer />
    </div>
  );
}
