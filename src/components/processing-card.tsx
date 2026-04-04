"use client";

import { useState, useEffect, useRef } from "react";
import { PROCESSING_MESSAGES } from "@/lib/constants";

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
      <div className="w-full max-w-sm neo-card bg-neo-blue p-8 flex flex-col items-center gap-8">
        {/* Dot spinner */}
        <div className="relative w-16 h-16">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const delay = -(i * 0.12);
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 w-3 h-3 bg-foreground neo-border"
                style={{
                  transform: `rotate(${angle}deg) translateY(-24px) translateX(-50%)`,
                  animation: `dot-fade 1s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>

        {/* Message */}
        <div className="text-center space-y-1">
          <p className="text-base font-bold text-foreground">Processing</p>
          <p
            className="text-xs font-medium text-foreground/60 transition-opacity duration-200 h-4"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {PROCESSING_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
