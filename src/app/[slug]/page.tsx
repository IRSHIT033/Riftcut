import { notFound } from "next/navigation";
import { SEO_PAGES } from "@/lib/seo-pages";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Shield, Zap, Globe, Lock } from "lucide-react";

export function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const page = SEO_PAGES.find((p) => p.slug === slug);
    if (!page) return {};

    return {
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      alternates: { canonical: `https://www.riftcut.pro/${page.slug}` },
      openGraph: {
        title: page.title,
        description: page.description,
        url: `https://www.riftcut.pro/${page.slug}`,
        siteName: "Riftcut",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: page.title,
        description: page.description,
      },
    };
  });
}

const TRUST_SIGNALS = [
  { icon: Shield, label: "No uploads", detail: "Files stay on your device" },
  { icon: Lock, label: "100% private", detail: "Zero data collection" },
  { icon: Zap, label: "Instant", detail: "No waiting, no queues" },
  { icon: Globe, label: "Works offline", detail: "After first load" },
];

export default async function SeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SEO_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: page.h1,
            url: `https://www.riftcut.pro/${page.slug}`,
            description: page.description,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section
            className="w-full border-b-3 border-foreground"
            style={{ backgroundColor: page.color }}
          >
            <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
              <div className="max-w-3xl">
                <div className="inline-block mb-5">
                  <span className="inline-block neo-btn bg-white px-4 py-1.5 text-xs font-bold rotate-[-2deg]">
                    FREE & 100% PRIVATE
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]"
                  style={{ fontFamily: "var(--font-brand), sans-serif" }}
                >
                  {page.h1}
                </h1>

                <p className="text-lg sm:text-xl font-medium text-foreground/70 mb-8 max-w-2xl">
                  {page.subtitle}
                </p>

                <Link
                  href={page.tool}
                  className="neo-btn inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 rounded-lg text-base font-bold"
                >
                  {page.toolLabel}
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>

          {/* Trust bar */}
          <section className="w-full border-b-3 border-foreground bg-foreground text-white">
            <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {TRUST_SIGNALS.map((signal) => (
                  <div key={signal.label} className="flex items-center gap-2.5">
                    <signal.icon className="w-4 h-4 shrink-0 opacity-70" strokeWidth={2.5} />
                    <div>
                      <div className="text-xs font-bold">{signal.label}</div>
                      <div className="text-[10px] opacity-60">{signal.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="w-full border-b-3 border-foreground bg-background">
            <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <h2
                className="text-2xl sm:text-3xl font-bold text-foreground mb-8"
                style={{ fontFamily: "var(--font-brand), sans-serif" }}
              >
                What You Get
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {page.features.map((feature) => (
                  <div
                    key={feature}
                    className="neo-card p-5 bg-white"
                  >
                    <p className="text-sm font-bold text-foreground">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="w-full border-b-3 border-foreground bg-neo-yellow/20">
            <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <h2
                className="text-2xl sm:text-3xl font-bold text-foreground mb-8"
                style={{ fontFamily: "var(--font-brand), sans-serif" }}
              >
                Perfect For
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {page.useCases.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-start gap-3 p-4"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-foreground" />
                    <p className="text-sm font-medium text-foreground/80">
                      {useCase}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full bg-background">
            <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
              <h2
                className="text-2xl sm:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-brand), sans-serif" }}
              >
                Ready? It&apos;s Free.
              </h2>
              <p className="text-base font-medium text-foreground/60 mb-8 max-w-xl mx-auto">
                No sign up, no credit card, no limits. Your files never leave your browser.
              </p>
              <Link
                href={page.tool}
                className="neo-btn inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg text-lg font-bold"
                style={{ backgroundColor: page.color, color: "#1a1a1a" }}
              >
                {page.toolLabel}
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
