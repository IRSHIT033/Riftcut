"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/context/app-context";
import { ComparisonSlider } from "./comparison-slider";
import { BackgroundEditor } from "./background-editor";
import { AspectRatioPicker } from "./aspect-ratio-picker";
import { DownloadPanel } from "./download-panel";
import { FloatingPanel } from "./floating-panel";
import { CropOverlay } from "./crop-editor";
import {
  compositeBackground,
  cropToAspectRatio,
  getImageDimensions,
  applyImageFilters,
  applyCrop,
} from "@/lib/canvas-utils";
import { ASPECT_RATIOS } from "@/lib/constants";
import { ImageFiltersEditor } from "./image-filters";
import { TextEditor } from "./text-editor";
import { TextOverlayLayer } from "./text-overlay-layer";
import {
  Palette,
  Crop,
  RotateCcw,
  Pencil,
  SlidersHorizontal,
  Move,
  SplitSquareHorizontal,
  Type,
} from "lucide-react";

interface ResultPanelProps {
  onReset: () => void;
}

export function ResultPanel({ onReset }: ResultPanelProps) {
  const { state, dispatch } = useApp();
  const [panelOpen, setPanelOpen] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [comparisonOriginal, setComparisonOriginal] = useState<string | null>(
    null
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const recompute = useCallback(async () => {
    if (!state.resultDataUrl || !state.originalDataUrl) return;

    let current = state.resultDataUrl;

    // Composite background
    if (state.background.type !== "transparent") {
      const dims = await getImageDimensions(current);
      current = await compositeBackground(
        current,
        state.background,
        dims.width,
        dims.height
      );
    }

    // Apply image filters after background so they affect the whole image
    const { filters } = state;
    const hasFilters =
      filters.grayscale ||
      filters.brightness !== 100 ||
      filters.contrast !== 100 ||
      filters.saturation !== 100;
    if (hasFilters) {
      current = await applyImageFilters(current, filters);
    }

    // Text overlays are rendered as interactive HTML on top of the image.
    // They are only baked into the canvas at download time.

    // Apply free crop
    if (state.cropRect) {
      current = await applyCrop(current, state.cropRect);
    }

    // Crop to aspect ratio
    if (state.aspectRatio) {
      const preset = ASPECT_RATIOS.find((r) => r.value === state.aspectRatio);
      if (preset?.ratio) {
        current = await cropToAspectRatio(current, preset.ratio);
        const croppedOriginal = await cropToAspectRatio(
          state.originalDataUrl,
          preset.ratio
        );
        setComparisonOriginal(croppedOriginal);
      }
    } else {
      setComparisonOriginal(null);
    }

    dispatch({ type: "SET_FINAL", dataUrl: current });
  }, [
    state.resultDataUrl,
    state.originalDataUrl,
    state.background,
    state.aspectRatio,
    state.filters,
    state.cropRect,
    dispatch,
  ]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(recompute, 80);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [recompute]);

  if (!state.originalDataUrl || !state.finalDataUrl) return null;

  const hasCrop =
    state.cropRect !== null &&
    !(
      state.cropRect.x < 0.001 &&
      state.cropRect.y < 0.001 &&
      state.cropRect.w > 0.999 &&
      state.cropRect.h > 0.999
    );

  return (
    <div className="animate-fade-in space-y-3 sm:space-y-5">
      {/* Main image area */}
      {cropMode ? (
        <CropOverlay />
      ) : (
        <div className="relative w-full" ref={imageContainerRef}>
          {/* Result image (default view) */}
          <div
            className={`transition-opacity duration-200 ease-out rounded-xl overflow-hidden checkerboard ${
              comparing ? "absolute inset-0 pointer-events-none" : ""
            }`}
            style={{ opacity: comparing ? 0 : 1 }}
          >
            <img
              src={state.finalDataUrl}
              alt="Background removed"
              className="w-full block max-h-[60vh] sm:max-h-[70vh] object-contain mx-auto"
              draggable={false}
            />
          </div>

          {/* Comparison slider (overlaid, fades in) */}
          <div
            className={`transition-opacity duration-200 ease-out ${
              comparing ? "" : "absolute inset-0 pointer-events-none"
            }`}
            style={{ opacity: comparing ? 1 : 0 }}
          >
            <ComparisonSlider
              originalSrc={comparisonOriginal ?? state.originalDataUrl}
              resultSrc={state.finalDataUrl}
            />
          </div>

          {/* Draggable text overlays */}
          {!comparing && state.textOverlays.length > 0 && (
            <TextOverlayLayer containerRef={imageContainerRef} />
          )}
        </div>
      )}

      {/* Processing time */}
      {state.processingTime && !cropMode && (
        <p className="text-center text-xs text-muted">
          Processed in {(state.processingTime / 1000).toFixed(1)}s
        </p>
      )}

      {/* Crop mode toolbar */}
      {cropMode && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCropMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg transition-colors"
          >
            Done
          </button>
          {hasCrop && (
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_CROP", crop: null })}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-surface-hover text-sm font-medium rounded-lg border border-border transition-colors text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Crop
            </button>
          )}
        </div>
      )}

      {/* Action bar */}
      {!cropMode && (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <DownloadPanel />

          <button
            type="button"
            onClick={() => setComparing(!comparing)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              comparing
                ? "bg-foreground text-background border-foreground"
                : "bg-surface hover:bg-surface-hover text-foreground border-border"
            }`}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            type="button"
            onClick={() => setPanelOpen(!panelOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              panelOpen
                ? "bg-foreground text-background border-foreground"
                : "bg-surface hover:bg-surface-hover text-foreground border-border"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface hover:bg-surface-hover text-sm font-medium rounded-lg border border-border transition-colors text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove Another</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      )}

      {/* Floating edit panel */}
      <FloatingPanel
        open={panelOpen && !cropMode}
        onClose={() => setPanelOpen(false)}
        title="Edit"
      >
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Palette className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Background
            </span>
          </div>
          <BackgroundEditor />
        </section>

        <div className="h-px bg-border/60" />

        {/* Crop — launches full-size crop mode on the main image */}
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Move className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Content Crop
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!state.cropRect) {
                  dispatch({ type: "SET_CROP", crop: { x: 0.1, y: 0.1, w: 0.8, h: 0.8 } });
                }
                setCropMode(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover text-sm font-medium rounded-lg border border-border transition-colors text-foreground"
            >
              <Crop className="w-3.5 h-3.5" />
              {hasCrop ? "Adjust Crop" : "Crop Image"}
            </button>
            {hasCrop && (
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_CROP", crop: null })}
                className="flex items-center gap-1 px-3 py-2 text-sm text-muted hover:text-foreground rounded-lg border border-border hover:bg-surface-hover transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Type className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Text
            </span>
          </div>
          <TextEditor />
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Photo Adjustments
            </span>
          </div>
          <ImageFiltersEditor />
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Crop className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Aspect Ratio
            </span>
          </div>
          <AspectRatioPicker />
        </section>
      </FloatingPanel>
    </div>
  );
}
