"use client";

import { useCallback } from "react";
import { useApp } from "@/context/app-context";
import type { ImageFilters } from "@/lib/types";

function FilterSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 200,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-xs tabular-nums text-muted">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-foreground"
      />
    </div>
  );
}

export function ImageFiltersEditor() {
  const { state, dispatch } = useApp();
  const { filters } = state;

  const update = useCallback(
    (partial: Partial<ImageFilters>) => {
      dispatch({ type: "SET_FILTERS", filters: partial });
    },
    [dispatch]
  );

  const isDefault =
    !filters.grayscale &&
    filters.brightness === 100 &&
    filters.contrast === 100 &&
    filters.saturation === 100;

  return (
    <div className="space-y-3">
      {/* B&W toggle */}
      <button
        type="button"
        onClick={() => update({ grayscale: !filters.grayscale })}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
          filters.grayscale
            ? "bg-foreground text-background border-foreground"
            : "bg-surface hover:bg-surface-hover text-foreground border-border"
        }`}
      >
        <span className="font-medium">Black & White</span>
        <span className="text-xs opacity-70">
          {filters.grayscale ? "On" : "Off"}
        </span>
      </button>

      {/* Sliders */}
      <FilterSlider
        label="Brightness"
        value={filters.brightness}
        onChange={(v) => update({ brightness: v })}
      />
      <FilterSlider
        label="Contrast"
        value={filters.contrast}
        onChange={(v) => update({ contrast: v })}
      />
      <FilterSlider
        label="Saturation"
        value={filters.saturation}
        onChange={(v) => update({ saturation: v })}
      />

      {/* Reset */}
      {!isDefault && (
        <button
          type="button"
          onClick={() =>
            update({
              grayscale: false,
              brightness: 100,
              contrast: 100,
              saturation: 100,
            })
          }
          className="w-full text-xs text-muted hover:text-foreground transition-colors py-1"
        >
          Reset adjustments
        </button>
      )}
    </div>
  );
}
