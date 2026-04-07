import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AppProvider } from "@/context/app-context";
import { RiftcutApp } from "@/components/riftcut-app";
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
    canonical: "https://riftcut.pro/bg-remover",
  },
  openGraph: {
    title: "Free AI Background Remover | Riftcut",
    description: "Remove image backgrounds instantly with AI. 100% private, runs in your browser.",
    url: "https://riftcut.pro/bg-remover",
  },
};

export default function BgRemoverPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="relative flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="animate-fade-in">
          <AppProvider>
            <RiftcutApp />
          </AppProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}
