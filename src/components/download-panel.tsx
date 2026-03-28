"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/context/app-context";
import { DOWNLOAD_SIZES } from "@/lib/constants";
import {
  downloadPNG,
  resizeImage,
  getImageDimensions,
  applyTextOverlays,
} from "@/lib/canvas-utils";
import { Download, ChevronUp } from "lucide-react";

export function DownloadPanel() {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const dataUrl = state.finalDataUrl;

  useEffect(() => {
    if (!dataUrl) return;
    getImageDimensions(dataUrl).then(setDimensions);
  }, [dataUrl]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen]);

  const handleDownload = useCallback(
    async (maxDim: number) => {
      if (!dataUrl) return;
      setDownloading(true);
      try {
        // Bake text overlays into the image at download time
        let output = dataUrl;
        if (state.textOverlays.length > 0) {
          output = await applyTextOverlays(output, state.textOverlays);
        }
        const resized = await resizeImage(output, maxDim);
        downloadPNG(resized, state.originalFileName);
      } finally {
        setDownloading(false);
        setIsOpen(false);
      }
    },
    [dataUrl, state.originalFileName, state.textOverlays]
  );

  function computeDims(maxDim: number) {
    if (!dimensions) return "";
    if (
      maxDim === Infinity ||
      (dimensions.width <= maxDim && dimensions.height <= maxDim)
    ) {
      return `${dimensions.width} x ${dimensions.height}`;
    }
    const scale = maxDim / Math.max(dimensions.width, dimensions.height);
    return `${Math.round(dimensions.width * scale)} x ${Math.round(dimensions.height * scale)}`;
  }

  return (
    <div className="relative" ref={panelRef}>
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => handleDownload(Infinity)}
          disabled={downloading || !dataUrl}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground hover:bg-foreground/90 text-background text-sm font-medium rounded-l-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? "Saving..." : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-2 bg-foreground hover:bg-foreground/90 text-background rounded-r-lg border-l border-background/20 transition-colors"
          aria-label="More download options"
        >
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-64 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          {DOWNLOAD_SIZES.map((preset) => {
            const dims = computeDims(preset.maxDim);
            const isOriginal = preset.maxDim === Infinity;
            const isDisabled =
              !isOriginal &&
              dimensions &&
              dimensions.width <= preset.maxDim &&
              dimensions.height <= preset.maxDim;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleDownload(preset.maxDim)}
                disabled={!!isDisabled && !isOriginal}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors text-left disabled:opacity-40"
              >
                <span className="text-sm text-foreground">{preset.label}</span>
                <span className="text-xs text-muted">{dims}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
