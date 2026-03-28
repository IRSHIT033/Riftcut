"use client";

import { useApp } from "@/context/app-context";
import { useImageProcessing } from "@/hooks/use-image-processing";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { UploadZone } from "./upload-zone";
import { ProgressCard } from "./progress-card";
import { ProcessingCard } from "./processing-card";
import { ErrorCard } from "./error-card";
import { ResultPanel } from "./result-panel";

export function RiftcutApp() {
  const { state } = useApp();
  const { processFile, reset } = useImageProcessing();
  useKeyboardShortcuts(processFile, reset);

  const showHero = state.phase !== "done";

  return (
    <div className="animate-fade-in">
      {showHero && (
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Remove Image Backgrounds Instantly
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            AI-powered background removal that runs entirely in your browser.
            Replace backgrounds, crop to any ratio, and download in any size.
          </p>
        </div>
      )}
      {state.phase === "idle" && <UploadZone onFile={processFile} />}
      {state.phase === "loading-model" && <ProgressCard />}
      {state.phase === "processing" && <ProcessingCard />}
      {state.phase === "error" && <ErrorCard onRetry={reset} />}
      {state.phase === "done" && <ResultPanel onReset={reset} />}
    </div>
  );
}
