"use client";

import { useRef, useState, useCallback } from "react";
import { useApp } from "@/context/app-context";
import type { CropRect } from "@/lib/types";

type Handle =
  | "tl"
  | "tr"
  | "bl"
  | "br"
  | "t"
  | "r"
  | "b"
  | "l"
  | "move";

const MIN_SIZE = 0.05;

export function CropOverlay() {
  const { state, dispatch } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
  const startRef = useRef({ mx: 0, my: 0, rect: { x: 0, y: 0, w: 1, h: 1 } as CropRect });

  const crop = state.cropRect ?? { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };
  const imgSrc = state.resultDataUrl;

  const setCrop = useCallback(
    (next: CropRect) => dispatch({ type: "SET_CROP", crop: next }),
    [dispatch]
  );

  const getRelative = useCallback((e: React.PointerEvent) => {
    const el = containerRef.current?.querySelector("img");
    if (!el) return { rx: 0, ry: 0, rw: 1, rh: 1 };
    const r = el.getBoundingClientRect();
    return { rx: r.left, ry: r.top, rw: r.width, rh: r.height };
  }, []);

  const onHandleDown = useCallback(
    (e: React.PointerEvent, handle: Handle) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveHandle(handle);
      startRef.current = { mx: e.clientX, my: e.clientY, rect: { ...crop } };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [crop]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!activeHandle) return;
      const img = containerRef.current?.querySelector("img");
      if (!img) return;
      const r = img.getBoundingClientRect();

      const dx = (e.clientX - startRef.current.mx) / r.width;
      const dy = (e.clientY - startRef.current.my) / r.height;
      const p = startRef.current.rect;
      let { x, y, w, h } = p;

      if (activeHandle === "move") {
        x = Math.max(0, Math.min(1 - p.w, p.x + dx));
        y = Math.max(0, Math.min(1 - p.h, p.y + dy));
        w = p.w;
        h = p.h;
      } else {
        if (activeHandle.includes("l")) { x = p.x + dx; w = p.w - dx; }
        if (activeHandle.includes("r")) { w = p.w + dx; }
        if (activeHandle.includes("t")) { y = p.y + dy; h = p.h - dy; }
        if (activeHandle.includes("b")) { h = p.h + dy; }
      }

      // Enforce minimums
      if (w < MIN_SIZE) {
        if (activeHandle.includes("l")) x = p.x + p.w - MIN_SIZE;
        w = MIN_SIZE;
      }
      if (h < MIN_SIZE) {
        if (activeHandle.includes("t")) y = p.y + p.h - MIN_SIZE;
        h = MIN_SIZE;
      }
      x = Math.max(0, Math.min(1 - MIN_SIZE, x));
      y = Math.max(0, Math.min(1 - MIN_SIZE, y));
      w = Math.min(w, 1 - x);
      h = Math.min(h, 1 - y);

      setCrop({ x, y, w, h });
    },
    [activeHandle, setCrop]
  );

  const onPointerUp = useCallback(() => setActiveHandle(null), []);

  // Click anywhere on the overlay → move the crop box
  const onBgDown = useCallback(
    (e: React.PointerEvent) => {
      onHandleDown(e, "move");
    },
    [onHandleDown]
  );

  if (!imgSrc) return null;

  const l = `${crop.x * 100}%`;
  const t = `${crop.y * 100}%`;
  const w = `${crop.w * 100}%`;
  const h = `${crop.h * 100}%`;

  const corners: { id: Handle; cursor: string; x: string; y: string }[] = [
    { id: "tl", cursor: "nwse-resize", x: l, y: t },
    { id: "tr", cursor: "nesw-resize", x: `${(crop.x + crop.w) * 100}%`, y: t },
    { id: "bl", cursor: "nesw-resize", x: l, y: `${(crop.y + crop.h) * 100}%` },
    { id: "br", cursor: "nwse-resize", x: `${(crop.x + crop.w) * 100}%`, y: `${(crop.y + crop.h) * 100}%` },
  ];

  const edges: { id: Handle; cursor: string; x: string; y: string }[] = [
    { id: "t", cursor: "ns-resize", x: `${(crop.x + crop.w / 2) * 100}%`, y: t },
    { id: "b", cursor: "ns-resize", x: `${(crop.x + crop.w / 2) * 100}%`, y: `${(crop.y + crop.h) * 100}%` },
    { id: "l", cursor: "ew-resize", x: l, y: `${(crop.y + crop.h / 2) * 100}%` },
    { id: "r", cursor: "ew-resize", x: `${(crop.x + crop.w) * 100}%`, y: `${(crop.y + crop.h / 2) * 100}%` },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden select-none touch-none checkerboard"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Result image */}
      <img
        src={imgSrc}
        alt="Crop preview"
        className="w-full block max-h-[60vh] sm:max-h-[70vh] object-contain mx-auto"
        draggable={false}
      />

      {/* Overlay layer positioned over the image */}
      <div
        className="absolute inset-0"
        onPointerDown={onBgDown}
      >
        {/* Dim mask — 4 rectangles around the crop */}
        {!isFullImage && (
          <>
            <div className="absolute left-0 right-0 top-0 bg-black/55 pointer-events-none" style={{ height: t }} />
            <div
              className="absolute left-0 right-0 bottom-0 bg-black/55 pointer-events-none"
              style={{ height: `${(1 - crop.y - crop.h) * 100}%` }}
            />
            <div
              className="absolute left-0 bg-black/55 pointer-events-none"
              style={{ top: t, height: h, width: l }}
            />
            <div
              className="absolute right-0 bg-black/55 pointer-events-none"
              style={{ top: t, height: h, width: `${(1 - crop.x - crop.w) * 100}%` }}
            />
          </>
        )}

        {/* Crop frame */}
        {!isFullImage && (
          <div
            className="absolute pointer-events-none"
            style={{ left: l, top: t, width: w, height: h }}
          >
            {/* Border */}
            <div className="absolute inset-0 border-2 border-foreground/90 rounded-sm" />

            {/* Corner brackets — thicker L-shapes */}
            {/* Top-left */}
            <div className="absolute -top-px -left-px w-5 h-0.5 bg-foreground rounded-full" />
            <div className="absolute -top-px -left-px h-5 w-0.5 bg-foreground rounded-full" />
            {/* Top-right */}
            <div className="absolute -top-px -right-px w-5 h-0.5 bg-foreground rounded-full" />
            <div className="absolute -top-px -right-px h-5 w-0.5 bg-foreground rounded-full" />
            {/* Bottom-left */}
            <div className="absolute -bottom-px -left-px w-5 h-0.5 bg-foreground rounded-full" />
            <div className="absolute -bottom-px -left-px h-5 w-0.5 bg-foreground rounded-full" />
            {/* Bottom-right */}
            <div className="absolute -bottom-px -right-px w-5 h-0.5 bg-foreground rounded-full" />
            <div className="absolute -bottom-px -right-px h-5 w-0.5 bg-foreground rounded-full" />

            {/* Rule of thirds grid */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-foreground/20" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-foreground/20" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-foreground/20" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-foreground/20" />
          </div>
        )}

        {/* Corner handles — large hit areas with visible dots */}
        {!isFullImage &&
          corners.map(({ id, cursor, x, y }) => (
            <div
              key={id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y, cursor, width: 28, height: 28 }}
              onPointerDown={(e) => onHandleDown(e, id)}
            >
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background shadow-md" />
            </div>
          ))}

        {/* Edge handles */}
        {!isFullImage &&
          edges.map(({ id, cursor, x, y }) => (
            <div
              key={id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: x,
                top: y,
                cursor,
                width: id === "t" || id === "b" ? 40 : 20,
                height: id === "l" || id === "r" ? 40 : 20,
              }}
              onPointerDown={(e) => onHandleDown(e, id)}
            >
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground/80 rounded-full"
                style={{
                  width: id === "t" || id === "b" ? 20 : 4,
                  height: id === "l" || id === "r" ? 20 : 4,
                }}
              />
            </div>
          ))}

        {/* Dimensions badge */}
        {!isFullImage && (
          <div
            className="absolute z-20 -translate-x-1/2 pointer-events-none"
            style={{
              left: `${(crop.x + crop.w / 2) * 100}%`,
              top: `${(crop.y + crop.h) * 100 + 1.5}%`,
            }}
          >
            <span className="inline-block px-2 py-0.5 bg-black/70 text-foreground text-[10px] font-medium rounded tabular-nums whitespace-nowrap">
              {Math.round(crop.w * 100)}% x {Math.round(crop.h * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded pointer-events-none">
        {isFullImage ? "Draw to crop" : "Crop"}
      </span>
    </div>
  );
}
