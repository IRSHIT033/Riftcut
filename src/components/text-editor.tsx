"use client";

import { useCallback } from "react";
import { useApp } from "@/context/app-context";
import type { TextOverlay } from "@/lib/types";
import { Bold, Italic, Plus, Trash2 } from "lucide-react";

const FONTS = [
  "Inter",
  "Playfair Display",
  "Roboto Mono",
  "Dancing Script",
  "Oswald",
  "Bebas Neue",
  "Pacifico",
  "Lora",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
] as const;

const COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

const STROKE_COLORS = [
  "none",
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
];

function createOverlay(): TextOverlay {
  return {
    id: crypto.randomUUID(),
    text: "Your text",
    fontFamily: "Inter",
    fontSize: 8,
    color: "#ffffff",
    strokeColor: "none",
    x: 0.5,
    y: 0.5,
    bold: false,
    italic: false,
  };
}

function OverlayEditor({
  overlay,
  onChange,
  onRemove,
}: {
  overlay: TextOverlay;
  onChange: (partial: Partial<TextOverlay>) => void;
  onRemove: () => void;
}) {
  const update = (partial: Partial<TextOverlay>) => onChange(partial);

  return (
    <div className="space-y-2.5 p-3 border-2 border-foreground bg-white neo-shadow-sm">
      {/* Text input */}
      <input
        type="text"
        value={overlay.text}
        onChange={(e) => update({ text: e.target.value })}
        placeholder="Enter text..."
        className="neo-input w-full px-3 py-2 text-sm font-medium"
      />

      {/* Font picker */}
      <select
        value={overlay.fontFamily}
        onChange={(e) => update({ fontFamily: e.target.value })}
        className="neo-input w-full px-3 py-2 text-sm font-medium"
      >
        {FONTS.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Size slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground/60">Size</span>
          <span className="text-xs font-bold text-foreground tabular-nums bg-neo-yellow px-1.5 py-0.5 border border-foreground">
            {overlay.fontSize}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={overlay.fontSize}
          onChange={(e) => update({ fontSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Color + Bold/Italic + Delete */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 flex-1">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update({ color: c })}
              className="w-5 h-5 border-2 border-foreground transition-transform"
              style={{
                backgroundColor: c,
                transform: overlay.color === c ? "scale(1.2)" : "scale(1)",
                boxShadow: overlay.color === c ? "2px 2px 0 #1a1a1a" : "none",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => update({ bold: !overlay.bold })}
          className={`neo-btn p-1.5 text-xs ${
            overlay.bold
              ? "bg-foreground text-white"
              : "bg-white text-foreground"
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => update({ italic: !overlay.italic })}
          className={`neo-btn p-1.5 text-xs ${
            overlay.italic
              ? "bg-foreground text-white"
              : "bg-white text-foreground"
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="neo-btn p-1.5 bg-neo-pink text-white"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Outline color */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-foreground/60">Outline</span>
        <div className="flex items-center gap-1">
          {STROKE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update({ strokeColor: c })}
              className="w-5 h-5 border-2 border-foreground transition-transform"
              style={{
                backgroundColor: c === "none" ? "transparent" : c,
                transform: overlay.strokeColor === c ? "scale(1.2)" : "scale(1)",
                boxShadow: overlay.strokeColor === c ? "2px 2px 0 #1a1a1a" : "none",
                ...(c === "none"
                  ? {
                      background:
                        "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50%/8px 8px",
                    }
                  : {}),
              }}
              title={c === "none" ? "No outline" : c}
            />
          ))}
        </div>
      </div>

      {/* Tip */}
      <p className="text-[11px] font-medium text-foreground/40">
        Drag text on the image to reposition
      </p>
    </div>
  );
}

export function TextEditor() {
  const { state, dispatch } = useApp();
  const overlays = state.textOverlays;

  const setOverlays = useCallback(
    (updated: TextOverlay[]) => {
      dispatch({ type: "SET_TEXT_OVERLAYS", overlays: updated });
    },
    [dispatch]
  );

  const addOverlay = () => {
    dispatch({
      type: "SET_TEXT_OVERLAYS",
      overlays: [...state.textOverlays, createOverlay()],
    });
  };

  const updateOverlay = useCallback(
    (id: string, partial: Partial<TextOverlay>) => {
      dispatch({
        type: "SET_TEXT_OVERLAYS",
        overlays: state.textOverlays.map((o) =>
          o.id === id ? { ...o, ...partial } : o
        ),
      });
    },
    [dispatch, state.textOverlays]
  );

  const removeOverlay = (id: string) =>
    setOverlays(state.textOverlays.filter((o) => o.id !== id));

  return (
    <div className="space-y-3">
      {overlays.map((overlay) => (
        <OverlayEditor
          key={overlay.id}
          overlay={overlay}
          onChange={(partial) => updateOverlay(overlay.id, partial)}
          onRemove={() => removeOverlay(overlay.id)}
        />
      ))}

      <button
        type="button"
        onClick={addOverlay}
        className="neo-btn w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-foreground text-sm font-bold rounded-lg"
      >
        <Plus className="w-4 h-4" />
        Add Text
      </button>

      {overlays.length > 0 && (
        <button
          type="button"
          onClick={() => setOverlays([])}
          className="w-full text-xs font-bold text-foreground/50 hover:text-foreground transition-colors py-1"
        >
          Remove all text
        </button>
      )}
    </div>
  );
}
