import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PdfImageEditor } from "@/components/pdf-image-editor";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import {
  webApplicationSchema,
  breadcrumbSchema,
  type FaqItem,
} from "@/lib/structured-data";
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
    canonical: "https://www.riftcut.pro/pdf-editor",
  },
  openGraph: {
    title: "Free PDF Image Editor | Riftcut",
    description: "Drag & drop images onto any PDF page. Position, resize, and download. Free and private.",
    url: "https://www.riftcut.pro/pdf-editor",
    siteName: "Riftcut",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Image Editor | Riftcut",
    description: "Drag & drop images onto any PDF page. Position, resize, and download. Free and private.",
  },
};

const FAQS: FaqItem[] = [
  {
    question: "How do I add an image to a PDF?",
    answer:
      "Open your PDF, drag and drop an image onto any page, then position and resize it visually before downloading the updated PDF.",
  },
  {
    question: "Can I reposition and resize images?",
    answer:
      "Yes. Every image can be dragged to any position on the page and resized freely until it looks exactly right.",
  },
  {
    question: "Are my PDFs uploaded to a server?",
    answer:
      "No. Editing happens entirely in your browser, so your PDFs and images never leave your device.",
  },
  {
    question: "Is the PDF image editor free?",
    answer:
      "Yes, it is completely free with no watermarks, no limits, and no sign up required.",
  },
];

export default function PdfEditorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd
        data={[
          webApplicationSchema({
            name: "Free PDF Image Editor",
            path: "/pdf-editor",
            description:
              "Add images anywhere in your PDF. Drag and drop images onto any page, position and resize them visually, then download. Free and private.",
            featureList: [
              "Add Images to PDF",
              "Drag to Position",
              "Visual Resize",
              "Multi-page Support",
              "Client-side Processing",
            ],
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Add Images to PDF", path: "/pdf-editor" },
          ]),
        ]}
      />
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <PdfImageEditor />
        </div>
      </main>
      <FaqSection faqs={FAQS} />
      <Footer />
    </div>
  );
}
