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
        relative border-2 border-dashed rounded-xl p-12 sm:p-16
        flex flex-col items-center justify-center gap-4
        cursor-pointer transition-all duration-200
        ${
          isDragOver
            ? "border-primary bg-primary-subtle"
            : "border-border hover:border-primary/50 hover:bg-primary-subtle/50"
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
      <Upload className="w-12 h-12 text-muted" strokeWidth={1.5} />

      <p className="text-lg font-medium text-foreground">
        Drop your image here
      </p>

      <p className="text-sm text-muted">or</p>

      <button
        type="button"
        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
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

      <p className="text-xs text-muted mt-2">
        Supports JPG, PNG, WebP — you can also paste from clipboard
      </p>
    </div>
  );
}
