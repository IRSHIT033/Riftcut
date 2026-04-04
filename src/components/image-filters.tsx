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
        <span className="text-xs font-bold text-foreground/60">{label}</span>
        <span className="text-xs font-bold text-foreground tabular-nums bg-neo-yellow px-1.5 py-0.5 border border-foreground">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
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
        className={`neo-btn w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold ${
          filters.grayscale
            ? "bg-foreground text-white"
            : "bg-white text-foreground"
        }`}
      >
        <span>Black & White</span>
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
          className="w-full text-xs font-bold text-foreground/50 hover:text-foreground transition-colors py-1"
        >
          Reset adjustments
        </button>
      )}
    </div>
  );
}
