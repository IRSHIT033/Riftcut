import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SeoPage } from "@/lib/seo-pages";

interface RelatedToolsProps {
  pages: SeoPage[];
  /** The parent tool path + label to always surface, e.g. the main tool page. */
  parentTool?: { href: string; label: string };
}

export function RelatedTools({ pages, parentTool }: RelatedToolsProps) {
  if (pages.length === 0 && !parentTool) return null;

  return (
    <section className="w-full border-t-3 border-foreground bg-neo-yellow/20">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2
          className="text-2xl sm:text-3xl font-bold text-foreground mb-8"
          style={{ fontFamily: "var(--font-brand), sans-serif" }}
        >
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="neo-card bg-white p-5 flex items-center justify-between gap-3 transition-all duration-100 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_#1a1a1a]"
            >
              <span className="text-sm font-bold text-foreground">{page.h1}</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-foreground" strokeWidth={2.5} />
            </Link>
          ))}
        </div>
        {parentTool && (
          <div className="mt-6">
            <Link
              href={parentTool.href}
              className="neo-btn inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 rounded-lg text-base font-bold"
            >
              {parentTool.label}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
