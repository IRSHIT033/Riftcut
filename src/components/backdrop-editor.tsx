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
            <span className="text-xs font-bold text-foreground/60">{label}</span>
            <span className="text-xs font-bold text-foreground tabular-nums bg-neo-yellow px-1.5 py-0.5 border border-foreground">
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
            className="w-full"
          />
        </div>
      ))}

      {/* Grayscale toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground/60">Grayscale</span>
        <button
          type="button"
          onClick={() => update({ grayscale: !bd.grayscale })}
          className={`neo-toggle relative w-10 h-6 ${
            bd.grayscale ? "bg-neo-green" : "bg-white"
          }`}
        >
          <span
            className={`neo-toggle-knob absolute top-[1px] left-[1px] w-5 h-5 bg-white ${
              bd.grayscale
                ? "translate-x-[16px] bg-foreground"
                : "translate-x-0"
            }`}
            style={{ background: bd.grayscale ? "#1a1a1a" : "#fff" }}
          />
        </button>
      </div>

      {/* Reset */}
      {!isDefault && (
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1 text-xs font-bold text-foreground/50 hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset backdrop
        </button>
      )}
    </div>
  );
}
