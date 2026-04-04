"use client";

import { useApp } from "@/context/app-context";
import { useImageProcessing } from "@/hooks/use-image-processing";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { UploadZone } from "./upload-zone";
import { ProgressCard } from "./progress-card";
import { ProcessingCard } from "./processing-card";
import { ErrorCard } from "./error-card";
import { ResultPanel } from "./result-panel";
import { ToolPageHeader } from "./tool-page-header";

export function RiftcutApp() {
  const { state } = useApp();
  const { processFile, reset } = useImageProcessing();
  useKeyboardShortcuts(processFile, reset);

  const showHero = state.phase !== "done";

  return (
    <div>
      {showHero && (
        <ToolPageHeader
          title="Background Remover"
          description="Drop an image below and watch the AI magic happen. Replace backgrounds, crop to any ratio, and download in any size."
          tag="AI POWERED"
          tagColor="#FF6B6B"
        />
      )}
      {state.phase === "idle" && <UploadZone onFile={processFile} />}
      {state.phase === "loading-model" && <ProgressCard />}
      {state.phase === "processing" && <ProcessingCard />}
      {state.phase === "error" && <ErrorCard onRetry={reset} />}
      {state.phase === "done" && <ResultPanel onReset={reset} />}
    </div>
  );
}
