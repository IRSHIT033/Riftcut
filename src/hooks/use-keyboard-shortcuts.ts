"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import { downloadPNG } from "@/lib/canvas-utils";

export function useKeyboardShortcuts(
  processFile: (file: File) => void,
  reset: () => void
) {
  const { state } = useApp();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd + S — Download result
      if (mod && e.key === "s") {
        e.preventDefault();
        if (state.finalDataUrl && state.phase === "done") {
          downloadPNG(state.finalDataUrl, state.originalFileName);
        }
      }

      // Escape — Reset
      if (e.key === "Escape") {
        if (state.phase === "done" || state.phase === "error") {
          reset();
        }
      }
    }

    function handlePaste(e: ClipboardEvent) {
      if (state.phase !== "idle") return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [state.phase, state.finalDataUrl, state.originalFileName, processFile, reset]);
}
