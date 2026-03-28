"use client";

import { useState, useEffect, useRef } from "react";
import { PROCESSING_MESSAGES } from "@/lib/constants";
import { Zap } from "lucide-react";

export function ProcessingCard() {
  const [messageIndex, setMessageIndex] = useState(() =>
    Math.floor(Math.random() * PROCESSING_MESSAGES.length)
  );
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
        setVisible(true);
      }, 200);
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="animate-fade-in flex justify-center">
      <div className="flex flex-col items-center gap-6 py-8">
        {/* Spinner */}
        <div className="relative w-24 h-24">
          {/* Ring 1 */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin-cw" />
          {/* Ring 2 */}
          <div className="absolute inset-3 rounded-full border-2 border-primary-hover/20 border-b-primary-hover animate-spin-ccw" />
          {/* Ring 3 */}
          <div className="absolute inset-6 rounded-full border-2 border-primary/20 border-t-primary/80 animate-spin-cw-fast" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center animate-pulse-scale">
            <Zap className="w-6 h-6 text-primary" fill="currentColor" />
          </div>
        </div>

        {/* Processing message */}
        <p
          className="text-sm text-muted text-center transition-opacity duration-200 h-5"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {PROCESSING_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
