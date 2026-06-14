# Scalable pSEO Engine — Design Spec

**Date:** 2026-06-15
**Status:** Approved (pending spec review)
**Owner:** Riftcut

## Problem

Riftcut has 31 programmatic SEO landing pages rendered from `src/lib/seo-pages.ts`
through a single `src/app/[slug]/page.tsx` template. The current setup has three
weaknesses that limit organic and AI-search visibility:

1. **Orphaned pages.** The 31 landing pages appear in `sitemap.xml` but are not
   linked from anywhere on the site. Orphaned pages are crawled and ranked poorly.
2. **Thin content.** Pages have a subtitle, a features list, and a use-cases list,
   but no unique body prose, no per-page FAQ, and no step-by-step guidance. Google's
   scaled-content-abuse policy and "helpful content" system demote templated,
   keyword-swapped pages.
3. **No AI-search readiness surface.** No `llms.txt`, and pages are not structured
   for direct-answer extraction by AI engines (ChatGPT, Perplexity, Google AI
   Overviews).

The goal is a **scalable engine**: a richer data model that makes thin pages
impossible to ship, a stronger template, a curated batch of new pages, internal
linking to kill orphans, and an `llms.txt` surface.

## Goals

- Make every landing page semantically complete and unique (penalty-safe at scale).
- Eliminate orphan pages via systematic internal linking.
- Add ~28 new hand-written landing pages across 4 archetypes.
- Upgrade all 31 existing pages to the new richer template.
- Add an `llms.txt` surface generated from the same data (never drifts).
- Confirm AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) stay allowed.

## Non-Goals (out of scope)

- Off-page E-E-A-T: backlinks, brand mentions, real user reviews. These drive AI
  citation and authority but are not code tasks. Noted for the user.
- `aggregateRating` / review schema — would be fabricated without a real review
  system; deliberately excluded (Google policy violation).
- An LLM build-time content generator. All content this round is hand-written.
- New tool functionality. Pages must map only to existing capabilities.

## Capability Constraints (pages must be backed by real features)

- **Background remover** (`/bg-remover`): AI background removal for JPG, PNG, WebP.
- **Converter** (`/convert`): {JPG, PNG, WebP, GIF, BMP} → PDF, and {DOC, DOCX} → PDF.
  No arbitrary format-to-format conversion.
- **Merge** (`/merge-pdf`): merge multiple PDFs and images into one PDF.
- **PDF editor** (`/pdf-editor`): add/position/resize images on PDF pages.

Format→PDF pages are limited to the real supported set. No "X to Y" doorway pages.

## Architecture

### 1. Data model upgrade — `src/lib/seo-pages.ts`

Extend the `SeoPage` interface with **required** fields so a page cannot compile
if it is thin:

```ts
export interface SeoPage {
  // existing
  slug: string;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  tool: string;
  toolLabel: string;
  category: "bg-remover" | "convert" | "merge-pdf" | "pdf-editor";
  color: string;
  keywords: string[];
  features: string[];
  useCases: string[];
  // NEW (all required)
  archetype: "subject" | "use-case" | "format" | "comparison";
  intro: string;            // 2-3 unique sentences of crawlable body prose
  howItWorks: string[];     // exactly 3 direct-answer steps
  faqs: FaqItem[];          // 3-4 unique Q&As (reuses FaqItem from structured-data.ts)
}
```

`related` pages are **computed**, not stored: a helper returns up to 4 sibling
pages in the same `category` (excluding self), falling back across archetypes if a
category is small.

### 2. Template upgrade — `src/app/[slug]/page.tsx`

Add, in order, to the existing layout:

- **Intro prose** block under the hero (unique crawlable text).
- **How it works** — 3 numbered steps from `page.howItWorks`.
- Existing Features + Use Cases sections (kept).
- **FAQ section** — reuse `FaqSection` component with `page.faqs`.
- **Related tools** — internal-link block to computed related pages + parent tool.

Structured data (via existing `JsonLd` + helpers from `src/lib/structured-data.ts`):
- `WebApplication` (existing)
- `BreadcrumbList` (existing)
- `FAQPage` (via `FaqSection`)
- **`HowTo`** (optional, low priority) — new helper `howToSchema(name, steps)` in
  `structured-data.ts`. Note: Google deprecated HowTo *rich results* in 2023, so this
  yields no rich snippet — it is kept only as semantic signal for AI/LLM extraction.
  The **visible** "How it works" steps are the real value (content + direct-answer
  format); the schema is a cheap bonus, not a ranking driver.

### 3. Internal linking (orphan fix)

- Each landing page → related siblings + parent tool (via Related block above).
- Homepage: extend the existing "Available Tools" section to surface a curated set
  of high-value landing pages (not all 59 — a hand-picked dozen).
- Footer: add a compact "Popular" links group if it does not already exist
  (verify `src/components/footer.tsx` during implementation).

### 4. New pages — hand-written, ~28 total

| Archetype | Count | Examples |
|-----------|-------|----------|
| Subject bg-removal | ~12 | car, dog, cat, hair, person, food, jewelry, clothing, furniture, shoes, flowers, glasses |
| Use-case / persona | ~10 | eBay, Etsy, Amazon sellers, Shopify, real estate, resume/CV, LinkedIn, Poshmark, Depop, marketplace |
| Format → PDF | ~3 | gif-to-pdf, bmp-to-pdf, docx-to-pdf |
| Comparison | ~3 | "free alternative to remove.bg", etc. (higher-risk; write carefully, factual) |

All content hand-written and unique. Comparison pages must be factual and
non-disparaging (compare on real differentiators: privacy, no upload, free).

### 5. Existing-page backfill

All 31 existing pages get the new required fields (`archetype`, `intro`,
`howItWorks`, `faqs`) hand-written so the whole site is uniform.

### 6. `llms.txt`

Dynamic route `src/app/llms.txt/route.ts` returning `text/plain` markdown,
generated from `seo-pages.ts` + the 4 core tools so it stays in sync:

```
# Riftcut

> Free private file toolkit. AI background remover, file converter, PDF merger,
> and PDF editor. 100% private — all processing in the browser, no uploads.

## Tools
- [Background Remover](https://www.riftcut.pro/bg-remover): ...
- [File Converter](https://www.riftcut.pro/convert): ...
...

## Guides
- [Remove Background from Photo](https://www.riftcut.pro/remove-background-from-photo): ...
...
```

Honest framing: AI crawlers rarely fetch `llms.txt` today (Google explicitly does
not support it; ClaudeBot reportedly consults it). Low-cost, future-proofing.

### 7. AI-crawler access

Verify `src/app/robots.ts` keeps all bots allowed (currently `userAgent: "*",
allow: "/"`). No change expected; confirm GPTBot/ClaudeBot/PerplexityBot/
Google-Extended are not blocked.

### 8. Sitemap

`sitemap.ts` already maps `SEO_PAGES`. New pages flow in automatically. Add the
new `llms.txt`? No — `llms.txt` is not an indexable HTML page; leave it out of the
sitemap.

## Data Flow

`seo-pages.ts` (single source of truth)
→ `generateStaticParams` (static page generation)
→ `[slug]/page.tsx` (renders prose + howItWorks + FAQ + related + JSON-LD)
→ `sitemap.ts` (URLs)
→ `llms.txt/route.ts` (AI surface)
→ homepage/footer (internal links)

## Components & Files

| File | Change |
|------|--------|
| `src/lib/seo-pages.ts` | Extend interface; backfill 31; add ~28; export `getRelatedPages()` |
| `src/lib/structured-data.ts` | Add `howToSchema()` |
| `src/app/[slug]/page.tsx` | Add intro, how-it-works, FAQ, related-links, HowTo schema |
| `src/components/related-tools.tsx` | NEW — internal-link block |
| `src/app/llms.txt/route.ts` | NEW — dynamic llms.txt |
| `src/app/page.tsx` | Surface curated landing pages in "Available Tools" |
| `src/components/footer.tsx` | Verify/add popular-links group |
| `src/app/robots.ts` | Verify AI bots allowed (likely no change) |

## Testing / Verification

- `npx tsc --noEmit` — types enforce required fields (no thin pages).
- `npm run build` — all pages prerender as static HTML.
- Spot-check rendered HTML for a sample of new pages: intro, FAQ, HowTo JSON-LD,
  related links present.
- `llms.txt` returns valid `text/plain` and lists all pages.
- Google Rich Results Test on 2-3 new URLs after deploy (manual, user).
- Confirm new pages appear in `sitemap.xml`.

## Risks

- **Scaled-content penalty** if pages are templated/thin → mitigated by required
  unique fields + hand-written content.
- **Comparison pages** can read as thin/aggressive → write factual, differentiator-
  based copy only.
- **Volume of hand-written content** (~59 pages × intro+3 steps+3-4 FAQs) is large →
  implementation plan should phase it (engine first, then content in batches).

## Rollout

1. Engine: interface, helpers, template, components (no content yet — seed 1-2).
2. Backfill 31 existing pages.
3. New pages in archetype batches.
4. `llms.txt` + homepage/footer internal links.
5. Build, verify, deploy, request indexing (manual).
