"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  /** The data-ad-slot id from your AdSense unit. */
  slot: string;
  /** Ad format, e.g. "auto" (default), "fluid", "rectangle". */
  format?: string;
  /** Enable full-width responsive behavior. Defaults to true. */
  responsive?: boolean;
  /** Optional layout key for in-feed/in-article ads. */
  layoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AD_CLIENT = "ca-pub-6905859223899384";

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  className,
  style,
}: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push failed", err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block", ...style }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout-key={layoutKey}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
