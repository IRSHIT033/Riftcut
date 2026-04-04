"use client";

import { useState, useCallback, useRef } from "react";
import { useApp } from "@/context/app-context";
import { COLOR_PRESETS } from "@/lib/constants";
import { ImagePlus } from "lucide-react";
import type { BackgroundConfig } from "@/lib/types";

export function BackgroundEditor() {
  const { state, dispatch } = useApp();
  const [customColor, setCustomColor] = useState("#6366f1");
  const bgInputRef = useRef<HTMLInputElement>(null);

  const setBackground = useCallback(
    (bg: BackgroundConfig) => {
      dispatch({ type: "SET_BACKGROUND", background: bg });
    },
    [dispatch]
  );

  const handleBgImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setBackground({ type: "image", imageDataUrl: dataUrl });
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [setBackground]
  );

  const isTransparent = state.background.type === "transparent";
  const activeColor =
    state.background.type === "color" ? state.background.color : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Transparent option */}
        <button
          type="button"
          onClick={() => setBackground({ type: "transparent" })}
          className={`w-9 h-9 border-2 border-foreground transition-all checkerboard ${
            isTransparent
              ? "ring-2 ring-neo-yellow ring-offset-1 neo-shadow-sm"
              : "hover:neo-shadow-sm"
          }`}
          aria-label="Transparent background"
          title="Transparent"
        />

        {/* Color presets */}
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() =>
              setBackground({ type: "color", color: preset.value })
            }
            className={`w-9 h-9 border-2 border-foreground transition-all ${
              activeColor === preset.value
                ? "ring-2 ring-neo-yellow ring-offset-1 neo-shadow-sm"
                : "hover:neo-shadow-sm"
            }`}
            style={{ backgroundColor: preset.value }}
            aria-label={`${preset.label} background`}
            title={preset.label}
          />
        ))}

        {/* Dominant color */}
        {state.dominantColor && (
          <button
            type="button"
            onClick={() =>
              setBackground({
                type: "color",
                color: state.dominantColor!,
              })
            }
            className={`w-9 h-9 border-2 border-foreground transition-all relative ${
              activeColor === state.dominantColor
                ? "ring-2 ring-neo-yellow ring-offset-1 neo-shadow-sm"
                : "hover:neo-shadow-sm"
            }`}
            style={{ backgroundColor: state.dominantColor }}
            aria-label="Dominant color from image"
            title="From image"
          >
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neo-yellow border-2 border-foreground text-[7px] text-foreground flex items-center justify-center font-bold">
              A
            </span>
          </button>
        )}

        {/* Custom color picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setBackground({ type: "color", color: customColor })
            }
            className={`w-9 h-9 border-2 border-foreground transition-all ${
              activeColor === customColor
                ? "ring-2 ring-neo-yellow ring-offset-1 neo-shadow-sm"
                : "hover:neo-shadow-sm"
            }`}
            style={{ backgroundColor: customColor }}
            aria-label="Custom color"
            title="Custom color"
          />
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              setBackground({ type: "color", color: e.target.value });
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-9 h-9"
          />
        </div>

        {/* Background image upload */}
        <button
          type="button"
          onClick={() => bgInputRef.current?.click()}
          className={`w-9 h-9 border-2 border-foreground transition-all flex items-center justify-center ${
            state.background.type === "image"
              ? "ring-2 ring-neo-yellow ring-offset-1 neo-shadow-sm bg-neo-blue"
              : "hover:neo-shadow-sm bg-white"
          }`}
          aria-label="Upload background image"
          title="Upload image"
        >
          <ImagePlus className="w-4 h-4 text-foreground" />
        </button>
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBgImageUpload}
        />
      </div>
    </div>
  );
}
