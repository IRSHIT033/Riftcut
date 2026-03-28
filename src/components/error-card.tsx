"use client";

import { useApp } from "@/context/app-context";
import { AlertCircle } from "lucide-react";

interface ErrorCardProps {
  onRetry: () => void;
}

export function ErrorCard({ onRetry }: ErrorCardProps) {
  const { state } = useApp();

  return (
    <div className="animate-fade-in flex justify-center">
      <div className="w-full max-w-md bg-surface rounded-xl border border-error/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            {state.errorMessage || "An unexpected error occurred."}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="w-full px-4 py-2.5 bg-surface-hover hover:bg-border text-sm font-medium rounded-lg transition-colors text-foreground"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
