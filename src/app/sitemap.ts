import type { MetadataRoute } from "next";
import { SEO_PAGES } from "@/lib/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://riftcut.pro";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/bg-remover`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-editor`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/merge-pdf`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SEO_PAGES.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
