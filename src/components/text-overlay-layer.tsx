"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useApp } from "@/context/app-context";
import type { TextOverlay } from "@/lib/types";

interface TextOverlayLayerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function TextOverlayLayer({ containerRef }: TextOverlayLayerProps) {
  const { state, dispatch } = useApp();
  const overlays = state.textOverlays;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setOverlays = useCallback(
    (updated: TextOverlay[]) => {
      dispatch({ type: "SET_TEXT_OVERLAYS", overlays: updated });
    },
    [dispatch]
  );

  const updateOverlay = useCallback(
    (id: string, partial: Partial<TextOverlay>) => {
      setOverlays(
        overlays.map((o) => (o.id === id ? { ...o, ...partial } : o))
      );
    },
    [overlays, setOverlays]
  );

  // Deselect when clicking outside any overlay
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-text-overlay]")) {
        setSelectedId(null);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  if (overlays.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10">
      {overlays.map((overlay) => (
        <DraggableText
          key={overlay.id}
          overlay={overlay}
          selected={selectedId === overlay.id}
          onSelect={() => setSelectedId(overlay.id)}
          onMove={(x, y) => updateOverlay(overlay.id, { x, y })}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

function DraggableText({
  overlay,
  selected,
  onSelect,
  onMove,
  containerRef,
}: {
  overlay: TextOverlay;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        startX: overlay.x * rect.width,
        startY: overlay.y * rect.height,
      };
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onSelect, containerRef, overlay.x, overlay.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const newX = Math.max(0, Math.min(1, (dragStart.current.startX + dx) / rect.width));
      const newY = Math.max(0, Math.min(1, (dragStart.current.startY + dy) / rect.height));
      onMove(newX, newY);
    },
    [dragging, containerRef, onMove]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Font size relative to container height
  const [containerH, setContainerH] = useState(400);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerH(entry.contentRect.height);
      }
    });
    ro.observe(el);
    setContainerH(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, [containerRef]);

  const fontSize = `${Math.round((overlay.fontSize / 100) * containerH)}px`;

  return (
    <div
      ref={elRef}
      data-text-overlay
      className={`absolute select-none transition-shadow duration-150 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: `${overlay.x * 100}%`,
        top: `${overlay.y * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Bounding box */}
      {selected && (
        <div className="absolute -inset-2 border-2 border-white/70 rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.3)]">
          {/* Corner handles */}
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white rounded-sm shadow-sm border border-black/20" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-sm shadow-sm border border-black/20" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white rounded-sm shadow-sm border border-black/20" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-sm shadow-sm border border-black/20" />
        </div>
      )}

      {/* Text */}
      <span
        className="whitespace-nowrap"
        style={{
          fontFamily: `"${overlay.fontFamily}", sans-serif`,
          fontSize,
          color: overlay.color,
          fontWeight: overlay.bold ? 700 : 400,
          fontStyle: overlay.italic ? "italic" : "normal",
          WebkitTextStroke:
            overlay.strokeColor && overlay.strokeColor !== "none"
              ? `${Math.max(1, parseInt(fontSize) / 12)}px ${overlay.strokeColor}`
              : undefined,
          paintOrder: "stroke fill",
        }}
      >
        {overlay.text || "Your text"}
      </span>
    </div>
  );
}
