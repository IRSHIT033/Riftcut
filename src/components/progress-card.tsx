"use client";

import { useApp } from "@/context/app-context";

export function ProgressCard() {
  const { state } = useApp();

  return (
    <div className="animate-fade-in flex justify-center">
      <div className="w-full max-w-md bg-surface rounded-xl border border-border p-6">
        <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-primary rounded-full progress-fill"
            style={{ width: `${state.modelProgress}%` }}
          />
        </div>
        <p className="text-sm text-muted text-center">
          {state.modelProgressText}
        </p>
      </div>
    </div>
  );
}
