"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { GripHorizontal, X } from "lucide-react";

interface FloatingPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function FloatingPanel({
  open,
  onClose,
  title,
  children,
}: FloatingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [closing, setClosing] = useState(false);

  // Reset position when panel opens
  useEffect(() => {
    if (open) {
      setPos(null);
      setClosing(false);
    }
  }, [open]);

  const clamp = useCallback((x: number, y: number) => {
    const el = panelRef.current;
    if (!el) return { x, y };
    const rect = el.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      setPos(clamp(newX, newY));
    },
    [dragging, clamp]
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 150);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  if (!open) return null;

  // Default position: bottom-center
  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { left: "50%", bottom: 24, transform: "translateX(-50%)" };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={title}
      className={`fixed z-50 w-[340px] sm:w-[380px] rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40 transition-opacity duration-150 ${
        closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        ...style,
        willChange: dragging ? "left, top" : "auto",
      }}
    >
      {/* Drag handle */}
      <div
        className={`flex items-center justify-between px-4 py-3 select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-muted/50" />
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Content */}
      <div className="px-4 py-4 space-y-4 overflow-y-auto max-h-[60vh]">{children}</div>
    </div>
  );
}
