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
          className="neo-btn flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-neo-green text-foreground text-sm font-bold rounded-l-lg disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{downloading ? "Saving..." : "Download PNG"}</span>
          <span className="sm:hidden">{downloading ? "..." : "Save"}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="neo-btn flex items-center px-2 sm:px-3 py-2.5 sm:py-3 bg-neo-green text-foreground rounded-r-lg border-l-3 border-foreground"
          aria-label="More download options"
        >
          <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-64 neo-card bg-white z-50 overflow-hidden animate-fade-in">
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
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-neo-yellow transition-colors text-left disabled:opacity-40 border-b-2 border-foreground last:border-b-0 font-medium"
              >
                <span className="text-sm font-bold text-foreground">{preset.label}</span>
                <span className="text-xs font-medium text-foreground/60">{dims}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
