"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, FileText, GripVertical, Trash2, RotateCcw, Loader2, Plus } from "lucide-react";
import { ToolPageHeader } from "./tool-page-header";

type EntryType = "pdf" | "image";

interface FileEntry {
  id: string;
  file: File;
  type: EntryType;
  pageCount: number | null;
  previewUrl: string | null;
  width: number | null;
  height: number | null;
}

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES = {
  a4: { w: 595.28, h: 841.89, label: "A4" },
  letter: { w: 612, h: 792, label: "Letter" },
  fit: { w: 0, h: 0, label: "Fit to Image" },
};

export function PdfMerger() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  const hasImages = files.some((f) => f.type === "image");

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (arr.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const entries: FileEntry[] = [];

      for (const file of arr) {
        const isPdf =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");
        const isImage = file.type.startsWith("image/");

        if (!isPdf && !isImage) continue;

        if (isPdf) {
          let pageCount: number | null = null;
          let pdfPreviewUrl: string | null = null;
          try {
            const { PDFDocument } = await import("pdf-lib");
            const buf = await file.arrayBuffer();
            const bufCopy = buf.slice(0);
            const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
            pageCount = pdf.getPageCount();

            // Render first page as thumbnail using pdfjs-dist
            try {
              const pdfjsLib = await import("pdfjs-dist");
              pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
              const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(bufCopy) });
              const pdfDoc = await loadingTask.promise;
              const page = await pdfDoc.getPage(1);
              const viewport = page.getViewport({ scale: 0.5 });
              const canvas = document.createElement("canvas");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext("2d")!;
              await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
              pdfPreviewUrl = canvas.toDataURL("image/png");
              pdfDoc.destroy();
            } catch {
              // Preview generation failed, will show icon fallback
            }
          } catch {
            pageCount = null;
          }
          entries.push({
            id: crypto.randomUUID(),
            file,
            type: "pdf",
            pageCount,
            previewUrl: pdfPreviewUrl,
            width: null,
            height: null,
          });
        } else {
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
            type: "image",
            pageCount: null,
            previewUrl: url,
            width: dims.width,
            height: dims.height,
          });
        }
      }

      if (entries.length === 0) {
        setError("No valid files found. Please select PDF or image files.");
      } else {
        setFiles((prev) => [...prev, ...entries]);
        setPreviewUrl(null);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files;
      if (f && f.length > 0) addFiles(f);
      e.target.value = "";
    },
    [addFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleDragStart = useCallback((idx: number) => { dragItemRef.current = idx; }, []);
  const handleDragEnter = useCallback((idx: number) => { dragOverRef.current = idx; }, []);
  const handleDragEnd = useCallback(() => {
    const from = dragItemRef.current;
    const to = dragOverRef.current;
    dragItemRef.current = null;
    dragOverRef.current = null;
    if (from === null || to === null || from === to) return;
    setFiles((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(from, 1);
      updated.splice(to, 0, item);
      return updated;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length === 0) return;
    setMerging(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();

      for (const entry of files) {
        if (entry.type === "pdf") {
          const buf = await entry.file.arrayBuffer();
          const src = await PDFDocument.load(buf, { ignoreEncryption: true });
          const pages = await merged.copyPages(src, src.getPageIndices());
          for (const page of pages) merged.addPage(page);
        } else {
          // Image -> embed into a PDF page
          const arrayBuf = await entry.file.arrayBuffer();
          let image;
          const type = entry.file.type;

          if (type === "image/png") {
            image = await merged.embedPng(arrayBuf);
          } else if (type === "image/jpeg" || type === "image/jpg") {
            image = await merged.embedJpg(arrayBuf);
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
            image = await merged.embedPng(await pngBlob.arrayBuffer());
          }

          if (pageSize === "fit") {
            const page = merged.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          } else {
            const size = PAGE_SIZES[pageSize];
            let pw = size.w, ph = size.h;
            if (orientation === "landscape") { pw = size.h; ph = size.w; }

            const page = merged.addPage([pw, ph]);
            const MARGIN = 36;
            const maxW = pw - 2 * MARGIN;
            const maxH = ph - 2 * MARGIN;
            const scale = Math.min(maxW / image.width, maxH / image.height, 1);
            const drawW = image.width * scale;
            const drawH = image.height * scale;
            page.drawImage(image, {
              x: (pw - drawW) / 2,
              y: (ph - drawH) / 2,
              width: drawW,
              height: drawH,
            });
          }
        }
      }

      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed. A file may be corrupted.");
    } finally {
      setMerging(false);
    }
  }, [files, pageSize, orientation, previewUrl]);

  const downloadResult = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "merged.pdf";
    a.click();
  }, [previewUrl]);

  const reset = useCallback(() => {
    for (const entry of files) {
      if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFiles([]);
    setPreviewUrl(null);
    setError(null);
  }, [files, previewUrl]);

  const isPreview = !!previewUrl;

  return (
    <div className="space-y-6">
      {/* Single file input - always mounted, accepts PDFs + images */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf,image/*"
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      {/* Hero -- only when idle */}
      {files.length === 0 && !isPreview && !loading && (
        <ToolPageHeader
          title="Merge PDFs & Images"
          description="Combine PDFs and images into one document. Mix file types, drag to reorder, preview before download."
          tag="MIX & MERGE"
          tagColor="#4CC9F0"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="neo-card bg-neo-yellow p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-foreground animate-spin" />
          <p className="text-sm font-bold text-foreground">Reading files...</p>
        </div>
      )}

      {/* Empty drop zone */}
      {files.length === 0 && !isPreview && !loading && (
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
            if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
          }}
          onClick={openFilePicker}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openFilePicker(); }}
        >
          <div className="w-16 h-16 bg-neo-blue neo-border neo-shadow flex items-center justify-center">
            <Upload className="w-8 h-8 text-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-bold text-foreground">Drop PDFs or images here</p>
          <p className="text-sm font-bold text-foreground/50">or</p>
          <button
            type="button"
            className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
            onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
          >
            Choose Files
          </button>
          <p className="text-xs font-bold text-foreground/40 mt-1">
            Mix PDFs and images -- they will be merged in order
          </p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && !isPreview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            {files.length > 1 && (
              <p className="text-xs font-bold text-foreground/40">Drag to reorder</p>
            )}
          </div>
          {files.map((entry, index) => (
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

              {entry.previewUrl ? (
                <div className="w-10 h-10 neo-border overflow-hidden flex-shrink-0 bg-white">
                  <img src={entry.previewUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-neo-pink neo-border flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{entry.file.name}</p>
                <p className="text-xs font-medium text-foreground/50">
                  {entry.type === "pdf" ? (
                    <>
                      {(entry.file.size / 1024).toFixed(1)} KB
                      {entry.pageCount !== null && ` -- ${entry.pageCount} page${entry.pageCount !== 1 ? "s" : ""}`}
                    </>
                  ) : (
                    <>
                      {entry.width} x {entry.height} -- {(entry.file.size / 1024).toFixed(1)} KB
                    </>
                  )}
                </p>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 neo-border flex-shrink-0 ${
                entry.type === "pdf" ? "bg-neo-pink text-white" : "bg-neo-green text-foreground"
              }`}>
                {entry.type === "pdf" ? "PDF" : "IMG"}
              </span>

              <button
                type="button"
                onClick={() => removeFile(entry.id)}
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
            Add More Files
          </button>
        </div>
      )}

      {/* Image page settings (only if there are images) */}
      {hasImages && files.length > 0 && !isPreview && (
        <div className="neo-card bg-white p-5 space-y-4">
          <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
            Image Page Settings
          </p>
          <div>
            <p className="text-xs font-bold text-foreground/50 mb-2">Page Size</p>
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
              <p className="text-xs font-bold text-foreground/50 mb-2">Orientation</p>
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
      )}

      {/* Merge / Create button */}
      {files.length >= 1 && !isPreview && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={merge}
            disabled={merging || files.length < 1}
            className="neo-btn flex items-center gap-2 bg-neo-green text-foreground px-8 py-3 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {merging ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              <><FileText className="w-4 h-4" /> {files.length === 1 ? "Create PDF" : `Merge ${files.length} Files`}</>
            )}
          </button>
          <button type="button" onClick={reset} className="neo-btn bg-white text-foreground px-5 py-3 rounded-lg text-sm font-bold">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="neo-card bg-neo-pink p-5 text-center">
          <p className="text-sm font-bold text-white">{error}</p>
        </div>
      )}

      {/* Preview + Download */}
      {isPreview && (
        <div className="space-y-5">
          <div className="neo-card bg-white overflow-hidden">
            <div className="bg-neo-green border-b-3 border-foreground px-4 py-3">
              <p className="text-sm font-bold text-foreground">
                Preview -- {files.length} file{files.length !== 1 ? "s" : ""} merged
              </p>
            </div>
            <div className="w-full" style={{ height: "70vh" }}>
              <iframe
                src={previewUrl!}
                title="PDF preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={downloadResult}
              className="neo-btn flex items-center gap-2 bg-neo-green text-foreground px-6 py-3 rounded-lg text-sm font-bold"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
              className="neo-btn flex items-center gap-2 bg-white text-foreground px-5 py-3 rounded-lg text-sm font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              Edit Order
            </button>
            <button
              type="button"
              onClick={reset}
              className="neo-btn flex items-center gap-2 bg-neo-yellow text-foreground px-5 py-3 rounded-lg text-sm font-bold"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
