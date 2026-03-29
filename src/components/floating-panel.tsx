"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { GripHorizontal, X, Pencil } from "lucide-react";

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
  const livePosRef = useRef<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [offScreen, setOffScreen] = useState(false);

  // Animate in/out without removing from DOM
  useEffect(() => {
    if (open) {
      setPos(null);
      livePosRef.current = null;
      setOffScreen(false);
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      setOffScreen(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Check if panel is off-screen after drag ends
  const checkOffScreen = useCallback(() => {
    const el = panelRef.current;
    if (!el || !livePosRef.current) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Consider off-screen if less than 40px of the panel is visible
    const visibleX = Math.min(rect.right, vw) - Math.max(rect.left, 0);
    const visibleY = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    setOffScreen(visibleX < 40 || visibleY < 40);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      // Lock in pixel position before first drag
      if (!pos && !livePosRef.current) {
        livePosRef.current = { x: rect.left, y: rect.top };
        setPos({ x: rect.left, y: rect.top });
      }
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const el = panelRef.current;
      if (!el) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      livePosRef.current = { x: newX, y: newY };
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
    },
    [dragging]
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
    if (livePosRef.current) {
      setPos(livePosRef.current);
    }
    checkOffScreen();
  }, [checkOffScreen]);

  const bringBack = useCallback(() => {
    const x = Math.max(12, (window.innerWidth - 380) / 2);
    const y = window.innerHeight - 400;
    const newPos = { x, y: Math.max(40, y) };
    livePosRef.current = newPos;
    setPos(newPos);
    setOffScreen(false);
    // Also update DOM directly for immediate feedback
    const el = panelRef.current;
    if (el) {
      el.style.left = `${newPos.x}px`;
      el.style.top = `${newPos.y}px`;
    }
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!mounted) return null;

  // Default position: bottom-center
  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { left: "50%", bottom: 12, transform: "translateX(-50%)" };

  return (
    <>
      <div
        ref={panelRef}
        role="dialog"
        aria-label={title}
        className="fixed z-50 w-[calc(100vw-24px)] max-w-[380px] rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40"
        style={{
          ...style,
          willChange: dragging ? "left, top" : "auto",
          opacity: visible ? 1 : 0,
          transition: pos
            ? "opacity 200ms ease-out"
            : "opacity 200ms ease-out, transform 200ms ease-out",
          ...(pos
            ? {}
            : { transform: `translateX(-50%) translateY(${visible ? "0" : "12px"})` }),
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
              onClick={onClose}
              className="rounded-lg p-1 text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-px bg-border/60" />

        {/* Content */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
          {children}
        </div>
      </div>

      {/* Bring-back pill when panel is off-screen */}
      {offScreen && (
        <button
          type="button"
          onClick={bringBack}
          className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-sm font-medium rounded-full shadow-lg shadow-black/30 animate-fade-in transition-transform hover:scale-105"
        >
          <Pencil className="w-3.5 h-3.5" />
          Show Edit Panel
        </button>
      )}
    </>
  );
}
