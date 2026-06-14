# Mixpanel Analytics — Design Spec

**Date:** 2026-06-15
**Status:** Approved (pending spec review)
**Owner:** Riftcut

## Problem

Riftcut has no product analytics. There is no visibility into which tools are
used, whether processing succeeds, or where users drop off. We want Mixpanel to
answer those questions, starting with a small, high-signal event set.

## Decisions (from brainstorming)

- **Standard Mixpanel**, not consent-gated. The site's absolute privacy claims
  ("no tracking, no data collection") will be reworded to stay accurate — the
  file-privacy claims (files never uploaded, processed in-browser) remain true
  and unchanged.
- **Scope: pageviews + key conversions** only. No comprehensive per-click
  tracking in v1.
- **Autocapture OFF, Session Replay OFF.** Session Replay would record users'
  on-screen images/PDFs — the exact files we promise never leave the device —
  and would regress the LCP/FCP work just shipped. Both are disabled.
- **Token** `a485371327a9032c3914a19032f92724` is supplied via
  `NEXT_PUBLIC_MIXPANEL_TOKEN`. Mixpanel browser tokens are public by design;
  the env var is for clean config/rotation, not secrecy.

## Goals

- Initialize Mixpanel once, client-side, with autocapture and session replay
  off.
- Track automatic pageviews on every route change.
- Track 4 event types (open, process, export, error) across all tool flows
  (bg-remover, convert, merge-pdf, pdf-editor, images-to-pdf).
- Zero impact on initial bundle / FCP / LCP (SDK dynamic-imported, init after
  hydration).
- No-op cleanly when the token is absent (dev, previews, CI builds never break).
- Reword inaccurate privacy copy.

## Non-Goals (out of scope)

- Autocapture, Session Replay, heatmaps, A/B testing.
- Server-side event proxy / ad-blocker evasion (possible later enhancement).
- Mixpanel People profiles, identify(), user accounts (there are no accounts).
- Consent banner / cookie management.
- Funnels/dashboards config inside Mixpanel (done in the Mixpanel UI, not code).

## Architecture

### 1. Analytics library — `src/lib/analytics.ts`

A thin, typed wrapper that owns all Mixpanel contact. Nothing else imports
`mixpanel-browser` directly.

```ts
// Event names + property shapes are a closed, typed union so call sites
// cannot invent ad-hoc events.
type AnalyticsEvent =
  | { name: "tool_opened"; props: { tool: Tool } }
  | { name: "file_processed"; props: { tool: Tool; action: ProcessAction } }
  | { name: "file_exported"; props: { tool: Tool; format: string } }
  | { name: "error_occurred"; props: { tool: Tool; message: string } };

type Tool = "bg-remover" | "convert" | "merge-pdf" | "pdf-editor" | "images-to-pdf";
type ProcessAction =
  | "background_removed" | "file_converted" | "pdf_merged"
  | "image_added" | "images_to_pdf";

export async function initAnalytics(): Promise<void>;   // lazy import + init, idempotent
export function trackPageview(path: string): void;
export function trackEvent<E extends AnalyticsEvent>(name: E["name"], props: E["props"]): void;
```

- `initAnalytics()` dynamic-imports `mixpanel-browser`, then
  `mixpanel.init(token, { autocapture: false, record_sessions_percent: 0, persistence: "localStorage", track_pageview: false })`.
  We drive pageviews manually (App Router client navigation), so the SDK's own
  `track_pageview` is off to avoid double counting.
- If `NEXT_PUBLIC_MIXPANEL_TOKEN` is missing, all functions become no-ops and
  `initAnalytics()` returns without importing the SDK.
- `trackEvent` / `trackPageview` queue or drop calls made before init resolves
  (simplest correct behavior: await the cached init promise internally).

### 2. Provider component — `src/components/analytics-provider.tsx`

`"use client"`. Responsibilities:
- On mount, call `initAnalytics()` once.
- Track a pageview whenever the route changes, using `usePathname()` +
  `useSearchParams()` from `next/navigation`.
- Because `useSearchParams()` requires a Suspense boundary in the App Router,
  the route-watching logic lives in an inner component wrapped in `<Suspense>`;
  the provider renders no visible UI.

Mounted once in `src/app/layout.tsx` (inside `<body>`).

### 3. Conversion event wiring

| Tool | `tool_opened` (mount) | `file_processed` | `file_exported` | `error_occurred` |
|------|----------------------|------------------|-----------------|------------------|
| bg-remover | `riftcut-app.tsx` | on removal success in `context/app-context` | `download-panel.tsx` `handleDownload` | bg-removal failure path |
| convert | `file-converter.tsx` | on `setResult(...)` success | `downloadResult` | convert catch block |
| merge-pdf | `pdf-merger.tsx` | on merge success | merge download handler | merge catch block |
| pdf-editor | `pdf-image-editor.tsx` | on image-add/export success | export/download handler | export catch block |
| images-to-pdf | `images-to-pdf.tsx` | on PDF build success | download handler | build catch block |

`tool_opened` fires from a `useEffect(() => {...}, [])` in each tool's main
client component. Each call site imports only `trackEvent` from
`@/lib/analytics` — never `mixpanel-browser`.

### 4. Config

- `.env.local` (gitignored) gets `NEXT_PUBLIC_MIXPANEL_TOKEN=a485371327a9032c3914a19032f92724`.
- The same var must be added to the hosting provider's environment for
  production.
- `.env.example` (committed) documents the variable with a placeholder so the
  requirement is discoverable.

### 5. Privacy copy updates

Replace the now-inaccurate absolute claims; keep the true file-privacy claims.

| File:line | Current | New |
|-----------|---------|-----|
| `src/app/page.tsx:259` | "No accounts, no tracking, no data collection." | "No accounts, no sign-up — your files are never uploaded." |
| `src/app/[slug]/page.tsx:53` | "Zero data collection" | "Files never uploaded" |

A full-text sweep for "no tracking" / "data collection" / "zero data" is part of
implementation to catch any other occurrences introduced by the pSEO pages.

## Data Flow

```
layout.tsx
  └─ <AnalyticsProvider>            (client, mounted once)
       ├─ initAnalytics()           → dynamic import mixpanel-browser, init (autocapture/replay off)
       └─ on route change           → trackPageview(path)  → page_viewed

tool client components
  ├─ mount                          → trackEvent("tool_opened", {tool})
  ├─ processing success             → trackEvent("file_processed", {tool, action})
  ├─ download/export                → trackEvent("file_exported", {tool, format})
  └─ catch                          → trackEvent("error_occurred", {tool, message})
```

## Components & Files

| File | Change |
|------|--------|
| `package.json` | Add `mixpanel-browser` + `@types/mixpanel-browser` (dev) |
| `src/lib/analytics.ts` | NEW — typed wrapper, lazy init, no-op without token |
| `src/components/analytics-provider.tsx` | NEW — init + pageview tracking, Suspense-wrapped |
| `src/app/layout.tsx` | Mount `<AnalyticsProvider>` in `<body>` |
| `src/components/riftcut-app.tsx` + `context/app-context` | `tool_opened`, `file_processed`, `error_occurred` |
| `src/components/download-panel.tsx` | `file_exported` |
| `src/components/file-converter.tsx` | `tool_opened`, `file_processed`, `file_exported`, `error_occurred` |
| `src/components/pdf-merger.tsx` | same four |
| `src/components/pdf-image-editor.tsx` | same four |
| `src/components/images-to-pdf.tsx` | same four |
| `.env.example` | NEW — document `NEXT_PUBLIC_MIXPANEL_TOKEN` |
| `src/app/page.tsx`, `src/app/[slug]/page.tsx` | Reword privacy copy |

## Performance

- `mixpanel-browser` (~25–30KB gz) is loaded via dynamic `import()` inside
  `initAnalytics()`, so it never enters the initial/critical bundle.
- Init runs in a client `useEffect` (after hydration), off the FCP/LCP path.
- Autocapture and Session Replay disabled → no continuous DOM observation or
  network chatter.

## Testing / Verification

- `npx tsc --noEmit` — typed event union compiles; no `any` at call sites.
- `npm run build` — all routes still prerender; no SSR access to `window`.
- Mixpanel Live View shows `page_viewed` on navigation and `tool_opened` /
  `file_processed` / `file_exported` for each of the 5 tool flows.
- With `NEXT_PUBLIC_MIXPANEL_TOKEN` unset: no network to mixpanel, no console
  errors, app fully functional (no-op path).
- Grep confirms no remaining "no tracking" / "zero data collection" copy.

## Risks

- **`useSearchParams` without Suspense** → build error / forced client rendering.
  Mitigated by the Suspense wrapper in the provider.
- **SSR `window` access** → init must be client-only (guarded, in `useEffect`).
- **Double-counted pageviews** if both SDK `track_pageview` and manual tracking
  run. Mitigated: SDK `track_pageview: false`, manual only.
- **Ad-blockers** drop some Mixpanel traffic; accepted for v1 (server proxy is a
  future option).

## Rollout

1. Install deps; add `src/lib/analytics.ts` + provider; mount in layout.
2. Add env var locally + on host; add `.env.example`.
3. Wire `tool_opened` + pageviews; verify in Live View.
4. Wire `file_processed` / `file_exported` / `error_occurred` per tool.
5. Reword privacy copy.
6. Build, verify, deploy.
