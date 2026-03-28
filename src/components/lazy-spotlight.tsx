"use client";

import dynamic from "next/dynamic";

const Spotlight = dynamic(
  () => import("@/components/ui/spotlight").then((m) => m.Spotlight),
  { ssr: false }
);

export function LazySpotlight() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
    </div>
  );
}
