import type { OverridedMixpanel } from "mixpanel-browser";

/**
 * Mixpanel wrapper. The only module that touches `mixpanel-browser` directly,
 * so the SDK can be dynamic-imported (kept out of the initial bundle) and every
 * call site stays typed against a closed event set.
 *
 * No-ops silently when NEXT_PUBLIC_MIXPANEL_TOKEN is absent, so dev, previews,
 * and CI builds never break and never emit data.
 */

export type Tool =
  | "bg-remover"
  | "convert"
  | "merge-pdf"
  | "pdf-editor"
  | "images-to-pdf";

export type ProcessAction =
  | "background_removed"
  | "file_converted"
  | "pdf_merged"
  | "image_added"
  | "images_to_pdf";

/** Closed set of events + their property shapes. Call sites cannot invent events. */
type EventMap = {
  tool_opened: { tool: Tool };
  file_processed: { tool: Tool; action: ProcessAction };
  file_exported: { tool: Tool; format: string };
  error_occurred: { tool: Tool; message: string };
};

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Cached init so the SDK is imported and initialized exactly once. Resolves to
// the mixpanel instance, or null when analytics is disabled / fails to load.
let initPromise: Promise<OverridedMixpanel | null> | null = null;

export function initAnalytics(): Promise<OverridedMixpanel | null> {
  if (initPromise) return initPromise;

  if (!TOKEN || typeof window === "undefined") {
    initPromise = Promise.resolve(null);
    return initPromise;
  }

  initPromise = import("mixpanel-browser")
    .then(({ default: mixpanel }) => {
      mixpanel.init(TOKEN, {
        autocapture: false, // no automatic click/interaction capture
        record_sessions_percent: 0, // session replay off — never record users' files
        track_pageview: false, // pageviews are tracked manually on route change
        persistence: "localStorage",
      });
      return mixpanel;
    })
    .catch(() => null);

  return initPromise;
}

/** Track a manual pageview. Safe to call before init resolves. */
export function trackPageview(path: string): void {
  void initAnalytics().then((mp) => mp?.track("page_viewed", { path }));
}

/** Track a typed product event. Safe to call before init resolves. */
export function trackEvent<K extends keyof EventMap>(
  name: K,
  props: EventMap[K],
): void {
  void initAnalytics().then((mp) => mp?.track(name, props));
}
