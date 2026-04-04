"use client";

import { useRef, useState, useCallback } from "react";

interface ComparisonSliderProps {
  originalSrc: string;
  resultSrc: string;
}

export function ComparisonSlider({
  originalSrc,
  resultSrc,
}: ComparisonSliderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0.5);
  const [dragging, setDragging] = useState(false);

  const updateFromEvent = useCallback(
    (clientX: number) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setPosition(pos);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setDragging(true);
      wrapperRef.current?.setPointerCapture(e.pointerId);
      updateFromEvent(e.clientX);
    },
    [updateFromEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      updateFromEvent(e.clientX);
    },
    [dragging, updateFromEvent]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const clipRight = (1 - position) * 100;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full neo-border rounded-xl overflow-hidden cursor-col-resize select-none touch-none checkerboard"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label="Compare original and processed images"
      aria-valuenow={Math.round(position * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* After image (result -- full width, bottom layer) */}
      <img
        src={resultSrc}
        alt="Background removed"
        className="w-full block max-h-[60vh] sm:max-h-[70vh] object-contain mx-auto"
        draggable={false}
      />

      {/* Before container (original -- clipped with clip-path so image stays full-size) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${clipRight}% 0 0)` }}
      >
        <img
          src={originalSrc}
          alt="Original"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-foreground -translate-x-1/2"
        style={{ left: `${position * 100}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-neo-yellow neo-border neo-shadow-sm flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            className="text-foreground"
          >
            <path
              d="M4 3L1 7L4 11M10 3L13 7L10 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 px-3 py-1.5 bg-white neo-border text-foreground text-xs font-bold neo-shadow-sm">
        Original
      </span>
      <span className="absolute top-3 right-3 px-3 py-1.5 bg-neo-green neo-border text-foreground text-xs font-bold neo-shadow-sm">
        Removed
      </span>
    </div>
  );
}
