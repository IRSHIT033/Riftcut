import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { SEO_PAGES } from "@/lib/seo-pages";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.slug }));
}

const CATEGORY_TAGS: Record<string, string> = {
  "bg-remover": "AI POWERED",
  convert: "MULTI-FORMAT",
  "merge-pdf": "MIX & MERGE",
  "pdf-editor": "VISUAL EDITOR",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SEO_PAGES.find((p) => p.slug === slug);

  if (!page) {
    return generateToolOgImage({
      title: "Riftcut",
      description: "Free Private File Toolkit",
      color: "#FFDE59",
      tag: "FREE TOOL",
    });
  }

  return generateToolOgImage({
    title: page.h1,
    description: page.subtitle,
    color: page.color,
    tag: CATEGORY_TAGS[page.category] ?? "FREE TOOL",
  });
}
