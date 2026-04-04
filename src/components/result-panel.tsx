"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/context/app-context";
import { ComparisonSlider } from "./comparison-slider";
import { BackgroundEditor } from "./background-editor";
import { AspectRatioPicker } from "./aspect-ratio-picker";
import { DownloadPanel } from "./download-panel";
import { FloatingPanel, type FloatingPanelHandle } from "./floating-panel";
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
import { BackdropEditor } from "./backdrop-editor";
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
  ImageDown,
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
  const panelRef = useRef<FloatingPanelHandle>(null);

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
    <div className="animate-fade-in space-y-4 sm:space-y-6">
      {/* Main image area */}
      {cropMode ? (
        <CropOverlay />
      ) : (
        <div className="relative w-full" ref={imageContainerRef}>
          {/* Result image (default view) */}
          <div
            className={`transition-opacity duration-200 ease-out neo-border rounded-xl overflow-hidden checkerboard ${
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
        <p className="text-center text-xs font-bold text-foreground/50">
          Processed in {(state.processingTime / 1000).toFixed(1)}s
        </p>
      )}

      {/* Crop mode toolbar */}
      {cropMode && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCropMode(false)}
            className="neo-btn flex items-center gap-2 px-5 py-2.5 bg-neo-green text-foreground text-sm font-bold rounded-lg"
          >
            Done
          </button>
          {hasCrop && (
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_CROP", crop: null })}
              className="neo-btn flex items-center gap-1.5 px-4 py-2.5 bg-white text-foreground text-sm font-bold rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Crop
            </button>
          )}
        </div>
      )}

      {/* Action bar */}
      {!cropMode && (
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          <DownloadPanel />

          <button
            type="button"
            onClick={() => setComparing(!comparing)}
            className={`neo-btn flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold rounded-lg ${
              comparing
                ? "bg-neo-purple text-white"
                : "bg-white text-foreground"
            }`}
          >
            <SplitSquareHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (panelOpen) {
                panelRef.current?.recenter();
              } else {
                setPanelOpen(true);
              }
            }}
            className={`neo-btn flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold rounded-lg ${
              panelOpen
                ? "bg-neo-yellow text-foreground"
                : "bg-white text-foreground"
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="neo-btn flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 bg-neo-blue text-foreground text-sm font-bold rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Remove Another</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      )}

      {/* Floating edit panel */}
      <FloatingPanel
        ref={panelRef}
        open={panelOpen && !cropMode}
        onClose={() => setPanelOpen(false)}
        title="Edit"
      >
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Palette className="w-4 h-4 text-foreground/50" />
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
              Background
            </span>
          </div>
          <BackgroundEditor />
        </section>

        {/* Backdrop editing -- only visible when background is an image */}
        {state.background.type === "image" && (
          <>
            <div className="h-[3px] bg-foreground/10" />
            <section>
              <div className="flex items-center gap-1.5 mb-2.5">
                <ImageDown className="w-4 h-4 text-foreground/50" />
                <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
                  Backdrop
                </span>
              </div>
              <BackdropEditor />
            </section>
          </>
        )}

        <div className="h-[3px] bg-foreground/10" />

        {/* Crop -- launches full-size crop mode on the main image */}
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Move className="w-4 h-4 text-foreground/50" />
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
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
              className="neo-btn flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-foreground text-sm font-bold rounded-lg"
            >
              <Crop className="w-4 h-4" />
              {hasCrop ? "Adjust Crop" : "Crop Image"}
            </button>
            {hasCrop && (
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_CROP", crop: null })}
                className="neo-btn flex items-center gap-1 px-3 py-2.5 bg-white text-foreground text-sm font-bold rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        <div className="h-[3px] bg-foreground/10" />

        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Type className="w-4 h-4 text-foreground/50" />
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
              Text
            </span>
          </div>
          <TextEditor />
        </section>

        <div className="h-[3px] bg-foreground/10" />

        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <SlidersHorizontal className="w-4 h-4 text-foreground/50" />
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
              Photo Adjustments
            </span>
          </div>
          <ImageFiltersEditor />
        </section>

        <div className="h-[3px] bg-foreground/10" />

        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Crop className="w-4 h-4 text-foreground/50" />
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
              Aspect Ratio
            </span>
          </div>
          <AspectRatioPicker />
        </section>
      </FloatingPanel>
    </div>
  );
}
