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
      <div className="relative min-h-screen flex flex-col">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        {/* Perspective grid */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30" style={{ perspective: 200 }}>
          <div className="absolute inset-0" style={{ transform: "rotateX(35deg)" }}>
            <div
              className="animate-grid"
              style={{
                position: "absolute",
                inset: "0% 0px",
                marginLeft: "-50%",
                height: "300vh",
                width: "600vw",
                transformOrigin: "100% 0 0",
                backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 0), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 0)",
                backgroundSize: "100px 100px",
              }}
            />
          </div>
          {/* Fade to black at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent to-90%" />
        </div>

        <Header />
        <main className="relative z-10 flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <AppProvider>
            <RiftcutApp />
          </AppProvider>
        </main>
        <Footer />
      </div>
    </>
  );
}
