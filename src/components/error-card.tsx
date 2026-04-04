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
      <div className="w-full max-w-md neo-card bg-neo-pink p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-white neo-border neo-shadow-sm flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-foreground" />
          </div>
          <p className="text-sm font-bold text-white pt-1">
            {state.errorMessage || "An unexpected error occurred."}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="neo-btn w-full px-4 py-3 bg-white text-foreground text-sm font-bold rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
