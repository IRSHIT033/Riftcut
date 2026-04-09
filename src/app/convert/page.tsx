import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileConverter } from "@/components/file-converter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free File Converter — Image to PDF, Word to PDF | Riftcut",
  description:
    "Convert images and Word documents to PDF for free, entirely in your browser. Supports JPG, PNG, WebP, GIF, BMP, DOC, and DOCX. No uploads, no servers, 100% private.",
  keywords: [
    "image to pdf",
    "convert image to pdf",
    "jpg to pdf",
    "png to pdf",
    "word to pdf",
    "docx to pdf",
    "free file converter",
    "online file converter",
    "convert to pdf",
    "private file converter",
  ],
  alternates: {
    canonical: "https://www.riftcut.pro/convert",
  },
  openGraph: {
    title: "Free File Converter — Image & Word to PDF | Riftcut",
    description: "Convert images and Word docs to PDF in your browser. Free, private, no uploads.",
    url: "https://www.riftcut.pro/convert",
    siteName: "Riftcut",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free File Converter — Image & Word to PDF | Riftcut",
    description: "Convert images and Word docs to PDF in your browser. Free, private, no uploads.",
  },
};

export default function ConvertPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <FileConverter />
        </div>
      </main>
      <Footer />
    </div>
  );
}
