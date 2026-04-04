"use client";

import { useApp } from "@/context/app-context";
import { ASPECT_RATIOS } from "@/lib/constants";

export function AspectRatioPicker() {
  const { state, dispatch } = useApp();

  const activeRatio = state.aspectRatio;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ASPECT_RATIOS.map((preset) => {
        const isActive =
          (preset.value === "original" && activeRatio === null) ||
          preset.value === activeRatio;

        return (
          <button
            key={preset.value}
            type="button"
            onClick={() =>
              dispatch({
                type: "SET_ASPECT_RATIO",
                ratio: preset.value === "original" ? null : preset.value,
              })
            }
            className={`neo-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold ${
              isActive
                ? "bg-neo-yellow text-foreground"
                : "bg-white text-foreground"
            }`}
          >
            <RatioIcon ratio={preset.ratio} active={isActive} />
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

function RatioIcon({
  ratio,
}: {
  ratio: number | null;
  active: boolean;
}) {
  const baseSize = 14;
  let w: number, h: number;

  if (ratio === null || ratio === 1) {
    w = h = baseSize;
  } else if (ratio > 1) {
    w = baseSize;
    h = Math.round(baseSize / ratio);
  } else {
    h = baseSize;
    w = Math.round(baseSize * ratio);
  }

  return (
    <span
      className="inline-block border-2 border-foreground"
      style={{ width: w, height: h }}
    />
  );
}
