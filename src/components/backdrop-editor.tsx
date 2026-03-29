"use client";

import { useCallback } from "react";
import { useApp } from "@/context/app-context";
import { DEFAULT_BACKDROP, type BackdropSettings } from "@/lib/types";
import { RotateCcw } from "lucide-react";

const SLIDERS: {
  key: keyof BackdropSettings;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: "blur", label: "Blur", min: 0, max: 20, step: 1, unit: "px" },
  { key: "opacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%" },
  { key: "scale", label: "Scale", min: 50, max: 200, step: 5, unit: "%" },
  { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, unit: "%" },
];

export function BackdropEditor() {
  const { state, dispatch } = useApp();

  if (state.background.type !== "image") return null;

  const bd = state.background.backdrop ?? DEFAULT_BACKDROP;

  const update = useCallback(
    (partial: Partial<BackdropSettings>) => {
      if (state.background.type !== "image") return;
      dispatch({
        type: "SET_BACKGROUND",
        background: {
          ...state.background,
          backdrop: { ...bd, ...partial },
        },
      });
    },
    [state.background, bd, dispatch]
  );

  const reset = useCallback(() => {
    if (state.background.type !== "image") return;
    dispatch({
      type: "SET_BACKGROUND",
      background: { ...state.background, backdrop: { ...DEFAULT_BACKDROP } },
    });
  }, [state.background, dispatch]);

  const isDefault =
    bd.blur === 0 &&
    bd.opacity === 100 &&
    bd.scale === 100 &&
    bd.brightness === 100 &&
    !bd.grayscale;

  return (
    <div className="space-y-3">
      {SLIDERS.map(({ key, label, min, max, step, unit }) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{label}</span>
            <span className="text-[11px] text-muted tabular-nums">
              {bd[key] as number}{unit}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={bd[key] as number}
            onChange={(e) => update({ [key]: Number(e.target.value) })}
            className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-foreground [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm"
          />
        </div>
      ))}

      {/* Grayscale toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Grayscale</span>
        <button
          type="button"
          onClick={() => update({ grayscale: !bd.grayscale })}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            bd.grayscale ? "bg-foreground" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
              bd.grayscale
                ? "translate-x-4 bg-background"
                : "translate-x-0 bg-muted"
            }`}
          />
        </button>
      </div>

      {/* Reset */}
      {!isDefault && (
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1 text-[11px] text-muted hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset backdrop
        </button>
      )}
    </div>
  );
}
