"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackPageview } from "@/lib/analytics";

// Inner component isolates useSearchParams(), which requires a Suspense boundary
// in the App Router. Fires on first render and on every client navigation.
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    trackPageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/** Initializes Mixpanel once and tracks pageviews. Renders no visible UI. */
export function AnalyticsProvider() {
  useEffect(() => {
    void initAnalytics();
  }, []);

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
