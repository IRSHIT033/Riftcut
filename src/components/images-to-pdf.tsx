"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, Image, GripVertical, Trash2, RotateCcw, Loader2, FileText, Plus } from "lucide-react";

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES = {
  a4: { w: 595.28, h: 841.89, label: "A4" },
  letter: { w: 612, h: 792, label: "Letter" },
  fit: { w: 0, h: 0, label: "Fit to Image" },
};

export function ImagesToPdf() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const addImages = useCallback(async (newFiles: FileList | File[]) => {
    setLoading(true);
    setError(null);
    try {
      const entries: ImageEntry[] = [];
      for (const file of Array.from(newFiles)) {
        if (!file.type.startsWith("image/")) continue;
        const url = URL.createObjectURL(file);
        const dims = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => resolve({ width: 800, height: 600 });
          img.src = url;
        });
        entries.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: url,
          width: dims.width,
          height: dims.height,
        });
      }
      if (entries.length === 0) {
        setError("No valid image files found. Please select image files.");
        return;
      }
      setImages((prev) => [...prev, ...entries]);
      setResult(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addImages(e.target.files);
      e.target.value = "";
    },
    [addImages]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const handleDragStart = useCallback((index: number) => {
    dragItemRef.current = index;
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragOverRef.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItemRef.current === null || dragOverRef.current === null) return;
    const from = dragItemRef.current;
    const to = dragOverRef.current;
    dragItemRef.current = null;
    dragOverRef.current = null;
    if (from === to) return;

    setImages((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(from, 1);
      updated.splice(to, 0, item);
      return updated;
    });
  }, []);

  const convert = useCallback(async () => {
    if (images.length === 0) return;
    setConverting(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();

      for (const entry of images) {
        const arrayBuf = await entry.file.arrayBuffer();

        let image;
        const type = entry.file.type;
        if (type === "image/png") {
          image = await pdf.embedPng(arrayBuf);
        } else if (type === "image/jpeg" || type === "image/jpg") {
          image = await pdf.embedJpg(arrayBuf);
        } else {
          const bitmap = await createImageBitmap(new Blob([arrayBuf], { type }));
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(bitmap, 0, 0);
          const pngBlob = await new Promise<Blob>((res) =>
            canvas.toBlob((b) => res(b!), "image/png")
          );
          const pngBuf = await pngBlob.arrayBuffer();
          image = await pdf.embedPng(pngBuf);
        }

        if (pageSize === "fit") {
          const page = pdf.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        } else {
          const size = PAGE_SIZES[pageSize];
          let pw = size.w;
          let ph = size.h;
          if (orientation === "landscape") {
            pw = size.h;
            ph = size.w;
          }

          const page = pdf.addPage([pw, ph]);
          const MARGIN = 36;
          const maxW = pw - 2 * MARGIN;
          const maxH = ph - 2 * MARGIN;

          const scale = Math.min(maxW / image.width, maxH / image.height, 1);
          const drawW = image.width * scale;
          const drawH = image.height * scale;
          const x = (pw - drawW) / 2;
          const y = (ph - drawH) / 2;

          page.drawImage(image, { x, y, width: drawW, height: drawH });
        }
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "images.pdf" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  }, [images, pageSize, orientation]);

  const downloadResult = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  }, [result]);

  const reset = useCallback(() => {
    for (const entry of images) URL.revokeObjectURL(entry.previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setImages([]);
    setResult(null);
    setError(null);
  }, [images, result]);

  return (
    <div className="space-y-6">
      {/* Single file input -- always in the DOM */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      {/* Loading state */}
      {loading && (
        <div className="neo-card bg-neo-yellow p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-foreground animate-spin" />
          <p className="text-sm font-bold text-foreground">Loading images...</p>
        </div>
      )}

      {/* Drop zone (no images yet, not loading) */}
      {images.length === 0 && !result && !loading && (
        <div
          role="button"
          tabIndex={0}
          className={`neo-card p-8 sm:p-12 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-100 ${
            isDragOver
              ? "bg-neo-yellow translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#1a1a1a]"
              : "bg-white"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files.length) addImages(e.dataTransfer.files);
          }}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openFilePicker();
          }}
        >
          <div className="w-16 h-16 bg-neo-green neo-border neo-shadow flex items-center justify-center">
            <Image className="w-8 h-8 text-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-bold text-foreground">Drop images here</p>
          <p className="text-sm font-bold text-foreground/50">or</p>
          <button
            type="button"
            className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
            onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
          >
            Choose Images
          </button>
          <p className="text-xs font-bold text-foreground/40 mt-1">
            Supports JPG, PNG, WebP, GIF, BMP
          </p>
        </div>
      )}

      {/* Image list */}
      {images.length > 0 && !result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs font-bold text-foreground/40">Drag to reorder</p>
          </div>
          {images.map((entry, index) => (
            <div
              key={entry.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="neo-card bg-white p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-foreground/30 flex-shrink-0" />
              <div className="w-12 h-12 neo-border overflow-hidden flex-shrink-0 bg-white">
                <img
                  src={entry.previewUrl}
                  alt={entry.file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{entry.file.name}</p>
                <p className="text-xs font-medium text-foreground/50">
                  {entry.width} x {entry.height} -- {(entry.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeImage(entry.id)}
                className="neo-btn p-2 bg-white text-foreground/50 hover:text-neo-pink"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={openFilePicker}
            className="neo-btn w-full flex items-center justify-center gap-2 bg-white text-foreground p-4 rounded-lg text-sm font-bold mt-3"
          >
            <Plus className="w-4 h-4" />
            Add More Images
          </button>
        </div>
      )}

      {/* Options + Convert */}
      {images.length > 0 && !result && (
        <div className="space-y-4">
          <div className="neo-card bg-white p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Page Size</p>
              <div className="flex items-center gap-2 flex-wrap">
                {(Object.entries(PAGE_SIZES) as [PageSize, typeof PAGE_SIZES.a4][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPageSize(key)}
                      className={`neo-btn px-4 py-2 rounded-md text-xs font-bold ${
                        pageSize === key ? "bg-neo-yellow text-foreground" : "bg-white text-foreground"
                      }`}
                    >
                      {val.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {pageSize !== "fit" && (
              <div>
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Orientation</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientation("portrait")}
                    className={`neo-btn px-4 py-2 rounded-md text-xs font-bold ${
                      orientation === "portrait" ? "bg-neo-blue text-foreground" : "bg-white text-foreground"
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation("landscape")}
                    className={`neo-btn px-4 py-2 rounded-md text-xs font-bold ${
                      orientation === "landscape" ? "bg-neo-blue text-foreground" : "bg-white text-foreground"
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={convert}
              disabled={converting}
              className="neo-btn flex items-center gap-2 bg-neo-green text-foreground px-8 py-3 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {converting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Create PDF
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              className="neo-btn flex items-center gap-2 bg-white text-foreground px-5 py-3 rounded-lg text-sm font-bold"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="neo-card bg-neo-pink p-5 text-center">
          <p className="text-sm font-bold text-white">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="neo-card bg-neo-green p-8 flex flex-col items-center gap-5">
          <div className="w-14 h-14 bg-white neo-border neo-shadow flex items-center justify-center">
            <FileText className="w-7 h-7 text-foreground" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">PDF Created</p>
            <p className="text-sm font-medium text-foreground/60 mt-1">
              {images.length} image{images.length !== 1 ? "s" : ""} combined
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadResult}
              className="neo-btn flex items-center gap-2 bg-white text-foreground px-6 py-3 rounded-lg text-sm font-bold"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={reset}
              className="neo-btn flex items-center gap-2 bg-neo-yellow text-foreground px-5 py-3 rounded-lg text-sm font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
