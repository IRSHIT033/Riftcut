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

function createOverlay(): TextOverlay {
  return {
    id: crypto.randomUUID(),
    text: "Your text",
    fontFamily: "Inter",
    fontSize: 8,
    color: "#ffffff",
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
  onChange: (updated: TextOverlay) => void;
  onRemove: () => void;
}) {
  const update = (partial: Partial<TextOverlay>) =>
    onChange({ ...overlay, ...partial });

  return (
    <div className="space-y-2.5 p-3 rounded-lg border border-border bg-background/50">
      {/* Text input */}
      <input
        type="text"
        value={overlay.text}
        onChange={(e) => update({ text: e.target.value })}
        placeholder="Enter text..."
        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-foreground/20"
      />

      {/* Font picker */}
      <select
        value={overlay.fontFamily}
        onChange={(e) => update({ fontFamily: e.target.value })}
        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
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
          <span className="text-xs text-muted">Size</span>
          <span className="text-xs tabular-nums text-muted">
            {overlay.fontSize}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={overlay.fontSize}
          onChange={(e) => update({ fontSize: Number(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-foreground"
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
              className="w-5 h-5 rounded-full border transition-transform"
              style={{
                backgroundColor: c,
                borderColor:
                  overlay.color === c ? "var(--foreground)" : "var(--border)",
                transform: overlay.color === c ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => update({ bold: !overlay.bold })}
          className={`p-1.5 rounded-md border text-xs transition-colors ${
            overlay.bold
              ? "bg-foreground text-background border-foreground"
              : "bg-surface text-foreground border-border hover:bg-surface-hover"
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => update({ italic: !overlay.italic })}
          className={`p-1.5 rounded-md border text-xs transition-colors ${
            overlay.italic
              ? "bg-foreground text-background border-foreground"
              : "bg-surface text-foreground border-border hover:bg-surface-hover"
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-md border border-border bg-surface text-muted hover:text-red-500 hover:border-red-500/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Position sliders */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-xs text-muted">X Position</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(overlay.x * 100)}
            onChange={(e) => update({ x: Number(e.target.value) / 100 })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-foreground"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted">Y Position</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(overlay.y * 100)}
            onChange={(e) => update({ y: Number(e.target.value) / 100 })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-foreground"
          />
        </div>
      </div>
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

  const addOverlay = () => setOverlays([...overlays, createOverlay()]);

  const updateOverlay = (id: string, updated: TextOverlay) =>
    setOverlays(overlays.map((o) => (o.id === id ? updated : o)));

  const removeOverlay = (id: string) =>
    setOverlays(overlays.filter((o) => o.id !== id));

  return (
    <div className="space-y-3">
      {overlays.map((overlay) => (
        <OverlayEditor
          key={overlay.id}
          overlay={overlay}
          onChange={(updated) => updateOverlay(overlay.id, updated)}
          onRemove={() => removeOverlay(overlay.id)}
        />
      ))}

      <button
        type="button"
        onClick={addOverlay}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover text-sm font-medium rounded-lg border border-border transition-colors text-foreground"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Text
      </button>

      {overlays.length > 0 && (
        <button
          type="button"
          onClick={() => setOverlays([])}
          className="w-full text-xs text-muted hover:text-foreground transition-colors py-1"
        >
          Remove all text
        </button>
      )}
    </div>
  );
}
