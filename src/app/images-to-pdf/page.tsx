import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImagesToPdf } from "@/components/images-to-pdf";
import { ToolPageHeader } from "@/components/tool-page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Images to PDF — Convert Multiple Images to PDF | Riftcut",
  description:
    "Convert multiple images into a single PDF document for free, entirely in your browser. Drag to reorder, choose A4 or Letter size, portrait or landscape. No uploads, 100% private.",
  keywords: [
    "images to pdf",
    "convert images to pdf",
    "photos to pdf",
    "multiple images to pdf",
    "jpg to pdf multiple",
    "pictures to pdf",
    "free images to pdf",
    "batch image to pdf",
    "create pdf from images",
    "private images to pdf",
  ],
  alternates: {
    canonical: "https://riftcut.app/images-to-pdf",
  },
  openGraph: {
    title: "Free Images to PDF Converter | Riftcut",
    description: "Convert multiple images into a single PDF. Reorder, resize, choose layout. Free and private.",
    url: "https://riftcut.app/images-to-pdf",
  },
};

export default function ImagesToPdfPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <ToolPageHeader
            title="Images to PDF"
            description="Convert multiple images into a single PDF. Drag to reorder, choose page size and orientation."
            tag="BATCH CONVERT"
            tagColor="#A7F205"
          />
          <ImagesToPdf />
        </div>
      </main>
      <Footer />
    </div>
  );
}
