"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onFile: (file: File) => void;
}

export function UploadZone({ onFile }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
      e.target.value = "";
    },
    [onFile]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload image for background removal"
      className={`
        relative neo-card p-10 sm:p-16
        flex flex-col items-center justify-center gap-5
        cursor-pointer transition-all duration-100
        ${
          isDragOver
            ? "bg-neo-yellow translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#1a1a1a]"
            : "bg-white"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="w-16 h-16 bg-neo-blue neo-border neo-shadow flex items-center justify-center">
        <Upload className="w-8 h-8 text-foreground" strokeWidth={2.5} />
      </div>

      <p className="text-xl font-bold text-foreground">
        Drop your image here
      </p>

      <p className="text-sm font-bold text-foreground/50">or</p>

      <button
        type="button"
        className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        Choose File
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <p className="text-xs font-bold text-foreground/40 mt-1">
        Supports JPG, PNG, WebP -- you can also paste from clipboard
      </p>
    </div>
  );
}
