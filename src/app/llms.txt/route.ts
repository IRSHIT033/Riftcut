import { SEO_PAGES } from "@/lib/seo-pages";
import { SITE_URL } from "@/lib/structured-data";

// Prerender as a static file at build time.
export const dynamic = "force-static";

const CORE_TOOLS = [
  {
    path: "/bg-remover",
    name: "AI Background Remover",
    desc: "Remove image backgrounds with AI, entirely in your browser. Supports JPG, PNG, WebP.",
  },
  {
    path: "/convert",
    name: "File Converter",
    desc: "Convert images (JPG, PNG, WebP, GIF, BMP) and Word documents (DOC, DOCX) to PDF.",
  },
  {
    path: "/merge-pdf",
    name: "PDF Merger",
    desc: "Merge multiple PDFs and images into a single PDF document.",
  },
  {
    path: "/pdf-editor",
    name: "PDF Image Editor",
    desc: "Add images, signatures, and logos to any PDF page, then download.",
  },
];

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# Riftcut");
  lines.push("");
  lines.push(
    "> Free, private file toolkit. AI background remover, file converter, PDF merger, " +
      "and PDF editor. All processing happens in your browser — your files are never " +
      "uploaded to a server. No sign up, no watermarks, works offline after first load.",
  );
  lines.push("");

  lines.push("## Tools");
  for (const tool of CORE_TOOLS) {
    lines.push(`- [${tool.name}](${SITE_URL}${tool.path}): ${tool.desc}`);
  }
  lines.push("");

  lines.push("## Guides");
  for (const page of SEO_PAGES) {
    lines.push(`- [${page.h1}](${SITE_URL}/${page.slug}): ${page.description}`);
  }
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
