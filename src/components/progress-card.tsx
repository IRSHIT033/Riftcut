"use client";

import { useApp } from "@/context/app-context";
import { Download } from "lucide-react";

export function ProgressCard() {
  const { state } = useApp();
  const progress = Math.round(state.modelProgress);

  return (
    <div className="animate-fade-in flex justify-center">
      <div className="w-full max-w-sm bg-surface rounded-2xl border border-border p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            Downloading AI Model
          </p>
          <p className="text-xs text-muted">
            First time only — runs locally after this
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-fill bg-gradient-to-r from-primary to-primary-hover"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>{state.modelProgressText.replace("Downloading AI model... ", "")}</span>
            <span className="tabular-nums font-medium text-foreground">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
