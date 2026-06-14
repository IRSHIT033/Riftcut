import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AppProvider } from "@/context/app-context";
import { RiftcutApp } from "@/components/riftcut-app";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import {
  webApplicationSchema,
  breadcrumbSchema,
  type FaqItem,
} from "@/lib/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Background Remover — Remove Image Backgrounds Instantly | Riftcut",
  description:
    "Remove image backgrounds in seconds with AI, entirely in your browser. 100% private — no uploads, no servers, no sign up. Supports JPG, PNG, WebP. Replace backgrounds, crop, add text, and download.",
  keywords: [
    "background remover",
    "remove background",
    "remove image background",
    "free background remover",
    "AI background removal",
    "transparent background",
    "remove bg",
    "photo background remover",
    "client-side background removal",
  ],
  alternates: {
    canonical: "https://www.riftcut.pro/bg-remover",
  },
  openGraph: {
    title: "Free AI Background Remover | Riftcut",
    description: "Remove image backgrounds instantly with AI. 100% private, runs in your browser.",
    url: "https://www.riftcut.pro/bg-remover",
    siteName: "Riftcut",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Background Remover | Riftcut",
    description: "Remove image backgrounds instantly with AI. 100% private, runs in your browser.",
  },
};

const FAQS: FaqItem[] = [
  {
    question: "Is the background remover really free?",
    answer:
      "Yes. Riftcut's background remover is completely free with no limits, no watermarks, no daily caps, and no account required.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. The AI runs entirely in your browser using WebGPU/WebAssembly. Your images never leave your device and are never uploaded anywhere.",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "You can remove backgrounds from JPG, PNG, and WebP images. The result downloads as a PNG with a transparent background.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Yes. After the page and AI model load once, the background remover keeps working without an internet connection.",
  },
];

export default function BgRemoverPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd
        data={[
          webApplicationSchema({
            name: "AI Background Remover",
            path: "/bg-remover",
            description:
              "Remove image backgrounds in seconds with AI, entirely in your browser. 100% private — no uploads, no servers, no sign up.",
            featureList: [
              "AI Background Removal",
              "Transparent PNG Export",
              "Replace Background with Color or Image",
              "Crop and Adjust",
              "Client-side Processing",
            ],
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Background Remover", path: "/bg-remover" },
          ]),
        ]}
      />
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <AppProvider>
            <RiftcutApp />
          </AppProvider>
        </div>
      </main>
      <FaqSection faqs={FAQS} />
      <Footer />
    </div>
  );
}
