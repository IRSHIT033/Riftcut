"use client";

import { useCallback } from "react";
import { useApp } from "@/context/app-context";
import { useInferenceWorker } from "./use-worker";
import {
  applyMask,
  downscaleIfNeeded,
} from "@/lib/canvas-utils";
import { extractDominantColor } from "@/lib/color-utils";
import { MAX_DIM_MOBILE, MAX_DIM_DESKTOP } from "@/lib/constants";
import type { WorkerOutMessage } from "@/lib/types";

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function useImageProcessing() {
  const { state, dispatch } = useApp();

  const handleWorkerMessage = useCallback(
    async (msg: WorkerOutMessage) => {
      switch (msg.status) {
        case "loading": {
          const progress = msg.progress || 0;
          const loaded = msg.loaded
            ? (msg.loaded / 1024 / 1024).toFixed(1)
            : "0";
          const total = msg.total
            ? (msg.total / 1024 / 1024).toFixed(1)
            : "?";
          dispatch({ type: "SET_PHASE", phase: "loading-model" });
          dispatch({
            type: "SET_MODEL_PROGRESS",
            progress,
            text: `Downloading AI model... ${loaded} / ${total} MB (${Math.round(progress)}%)`,
          });
          break;
        }
        case "model-ready":
          dispatch({ type: "SET_MODEL_LOADED" });
          break;
        case "processing":
          dispatch({ type: "SET_PHASE", phase: "processing" });
          dispatch({ type: "SET_PROCESSING_START" });
          break;
        case "result": {
          if (!msg.mask || !state.originalDataUrl) return;
          try {
            const resultDataUrl = await applyMask(
              state.originalDataUrl,
              msg.mask
            );
            const elapsed = state.processingStartTime
              ? Date.now() - state.processingStartTime
              : null;
            if (elapsed) {
              dispatch({ type: "SET_PROCESSING_TIME", time: elapsed });
            }
            dispatch({ type: "SET_RESULT", dataUrl: resultDataUrl });
            dispatch({ type: "SET_PHASE", phase: "done" });
          } catch {
            dispatch({
              type: "SET_ERROR",
              message: "Failed to process the result. Please try again.",
            });
          }
          break;
        }
        case "error":
          dispatch({
            type: "SET_ERROR",
            message: msg.message || "An unexpected error occurred.",
          });
          break;
      }
    },
    [dispatch, state.originalDataUrl, state.processingStartTime]
  );

  const { postMessage } = useInferenceWorker(handleWorkerMessage);

  const processFile = useCallback(
    async (file: File) => {
      if (!file || !file.type.startsWith("image/")) {
        dispatch({
          type: "SET_ERROR",
          message: "Please select a valid image file (JPG, PNG, or WebP).",
        });
        return;
      }

      const baseName = file.name
        ? file.name.replace(/\.[^.]+$/, "")
        : "image";
      const fileName = baseName + "-bg-removed.png";

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const maxDim = isMobile() ? MAX_DIM_MOBILE : MAX_DIM_DESKTOP;
        const scaled = await downscaleIfNeeded(dataUrl, maxDim);

        dispatch({ type: "SET_ORIGINAL_IMAGE", dataUrl: scaled, fileName });

        // Extract dominant color in parallel
        extractDominantColor(scaled).then((color) => {
          dispatch({ type: "SET_DOMINANT_COLOR", color });
        });

        postMessage({ action: "process", imageData: scaled });
        dispatch({
          type: "SET_PHASE",
          phase: state.modelLoaded ? "processing" : "loading-model",
        });
      };
      reader.onerror = () =>
        dispatch({
          type: "SET_ERROR",
          message: "Failed to read the image file.",
        });
      reader.readAsDataURL(file);
    },
    [dispatch, postMessage, state.modelLoaded]
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return { processFile, reset };
}
