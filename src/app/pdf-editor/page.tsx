import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PdfImageEditor } from "@/components/pdf-image-editor";
import { ToolPageHeader } from "@/components/tool-page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Image Editor — Add Images to PDF | Riftcut",
  description:
    "Add images anywhere in your PDF. Drag and drop images onto any page, position and resize them visually, then download. Free, private, runs in your browser.",
  keywords: [
    "add image to pdf",
    "insert image in pdf",
    "pdf image editor",
    "drag image to pdf",
    "pdf editor online",
    "free pdf editor",
    "add photo to pdf",
    "overlay image on pdf",
    "edit pdf online",
    "private pdf editor",
  ],
  alternates: {
    canonical: "https://riftcut.app/pdf-editor",
  },
  openGraph: {
    title: "Free PDF Image Editor | Riftcut",
    description: "Drag & drop images onto any PDF page. Position, resize, and download. Free and private.",
    url: "https://riftcut.app/pdf-editor",
  },
};

export default function PdfEditorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <ToolPageHeader
            title="Add Images to PDF"
            description="Upload a PDF, then drag & drop images onto any page. Position and resize them anywhere you want."
            tag="VISUAL EDITOR"
            tagColor="#FF914D"
          />
          <PdfImageEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
}
