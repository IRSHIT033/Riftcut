"use client";

import { useApp } from "@/context/app-context";
import { Download } from "lucide-react";

export function ProgressCard() {
  const { state } = useApp();
  const progress = Math.round(state.modelProgress);

  return (
    <div className="animate-fade-in flex justify-center">
      <div className="w-full max-w-sm neo-card bg-neo-yellow p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-white neo-border neo-shadow flex items-center justify-center">
            <Download className="w-6 h-6 text-foreground animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <p className="text-base font-bold text-foreground">
            Downloading AI Model
          </p>
          <p className="text-xs font-medium text-foreground/60">
            First time only -- runs locally after this
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-white neo-border overflow-hidden">
            <div
              className="h-full progress-fill bg-neo-green"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span>{state.modelProgressText.replace("Downloading AI model... ", "")}</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
