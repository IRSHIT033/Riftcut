"use client";

import { useEffect, useRef, useCallback } from "react";
import type { WorkerOutMessage } from "@/lib/types";

export function useInferenceWorker(
  onMessage: (msg: WorkerOutMessage) => void
) {
  const workerRef = useRef<Worker | null>(null);
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/inference.worker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      callbackRef.current(e.data);
    };

    worker.onerror = () => {
      callbackRef.current({
        status: "error",
        message: "An unexpected error occurred. Please refresh and try again.",
      });
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const postMessage = useCallback((message: { action: string; imageData?: string }) => {
    workerRef.current?.postMessage(message);
  }, []);

  return { postMessage };
}
