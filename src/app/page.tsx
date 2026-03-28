import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AppProvider } from "@/context/app-context";
import { RiftcutApp } from "@/components/riftcut-app";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Riftcut",
            description:
              "AI-powered background removal tool that runs entirely in your browser",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            browserRequirements:
              "Requires a modern browser with WebGPU or WebAssembly support",
          }),
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <AppProvider>
            <RiftcutApp />
          </AppProvider>
        </main>
        <Footer />
      </div>
    </>
  );
}
