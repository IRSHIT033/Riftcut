import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileConverter } from "@/components/file-converter";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import {
  webApplicationSchema,
  breadcrumbSchema,
  type FaqItem,
} from "@/lib/structured-data";
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

const FAQS: FaqItem[] = [
  {
    question: "What files can I convert to PDF?",
    answer:
      "You can convert images (JPG, PNG, WebP, GIF, BMP) and Word documents (DOC, DOCX) to PDF, all in your browser.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. Conversion happens entirely on your device. Your files are never uploaded, so the tool is fully private.",
  },
  {
    question: "Is the file converter free?",
    answer:
      "Yes, completely free with no watermarks, no file limits, and no sign up required.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "There is no fixed limit. Because everything runs locally, the practical limit depends on your device's available memory.",
  },
];

export default function ConvertPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd
        data={[
          webApplicationSchema({
            name: "Free File Converter",
            path: "/convert",
            description:
              "Convert images and Word documents to PDF for free, entirely in your browser. Supports JPG, PNG, WebP, GIF, BMP, DOC, and DOCX.",
            featureList: [
              "Image to PDF Conversion",
              "Word to PDF Conversion",
              "Supports JPG, PNG, WebP, GIF, BMP",
              "Supports DOC and DOCX",
              "Client-side Processing",
            ],
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "File Converter", path: "/convert" },
          ]),
        ]}
      />
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <FileConverter />
        </div>
      </main>
      <FaqSection faqs={FAQS} />
      <Footer />
    </div>
  );
}
