"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/context/app-context";
import { ComparisonSlider } from "./comparison-slider";
import { BackgroundEditor } from "./background-editor";
import { AspectRatioPicker } from "./aspect-ratio-picker";
import { DownloadPanel } from "./download-panel";
import {
  compositeBackground,
  cropToAspectRatio,
  getImageDimensions,
} from "@/lib/canvas-utils";
import { ASPECT_RATIOS } from "@/lib/constants";
import { Palette, Crop, RotateCcw } from "lucide-react";

type ActiveTab = "background" | "ratio";

interface ResultPanelProps {
  onReset: () => void;
}

export function ResultPanel({ onReset }: ResultPanelProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>("background");
  const [comparisonOriginal, setComparisonOriginal] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Recompute finalDataUrl when background or aspect ratio changes
  const recompute = useCallback(async () => {
    if (!state.resultDataUrl || !state.originalDataUrl) return;

    let current = state.resultDataUrl;

    // Apply background
    if (state.background.type !== "transparent") {
      const dims = await getImageDimensions(current);
      current = await compositeBackground(
        state.resultDataUrl,
        state.background,
        dims.width,
        dims.height
      );
    }

    // Apply aspect ratio crop
    if (state.aspectRatio) {
      const preset = ASPECT_RATIOS.find((r) => r.value === state.aspectRatio);
      if (preset?.ratio) {
        current = await cropToAspectRatio(current, preset.ratio);
        // Crop original to the same aspect ratio so comparison stays aligned
        const croppedOriginal = await cropToAspectRatio(state.originalDataUrl, preset.ratio);
        setComparisonOriginal(croppedOriginal);
      }
    } else {
      setComparisonOriginal(null);
    }

    dispatch({ type: "SET_FINAL", dataUrl: current });
  }, [state.resultDataUrl, state.originalDataUrl, state.background, state.aspectRatio, dispatch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(recompute, 80);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [recompute]);

  if (!state.originalDataUrl || !state.finalDataUrl) return null;

  const tabs = [
    { id: "background" as const, label: "Background", icon: Palette },
    { id: "ratio" as const, label: "Aspect Ratio", icon: Crop },
  ];

  return (
    <div className="animate-fade-in space-y-3 sm:space-y-5">
      {/* Comparison slider */}
      <ComparisonSlider
        originalSrc={comparisonOriginal ?? state.originalDataUrl}
        resultSrc={state.finalDataUrl}
      />

      {/* Processing time */}
      {state.processingTime && (
        <p className="text-center text-xs text-muted">
          Processed in {(state.processingTime / 1000).toFixed(1)}s
        </p>
      )}

      {/* Editing toolbar */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {/* Tab buttons */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary bg-primary-subtle"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-4">
          {activeTab === "background" && <BackgroundEditor />}
          {activeTab === "ratio" && <AspectRatioPicker />}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
        <DownloadPanel />
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-hover text-sm font-medium rounded-lg border border-border transition-colors text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
          Remove Another Background
        </button>
      </div>
    </div>
  );
}
