"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, FileText, GripVertical, Trash2, RotateCcw, Loader2 } from "lucide-react";

interface PdfEntry {
  id: string;
  file: File;
  pageCount: number | null;
}

export function PdfMerger() {
  const [files, setFiles] = useState<PdfEntry[]>([]);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const { PDFDocument } = await import("pdf-lib");
    const entries: PdfEntry[] = [];

    for (const file of Array.from(newFiles)) {
      if (file.type !== "application/pdf") continue;
      let pageCount: number | null = null;
      try {
        const buf = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        pageCount = pdf.getPageCount();
      } catch {
        pageCount = null;
      }
      entries.push({
        id: crypto.randomUUID(),
        file,
        pageCount,
      });
    }

    setFiles((prev) => [...prev, ...entries]);
    setResult(null);
    setError(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
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
    if (from === to) return;

    setFiles((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(from, 1);
      updated.splice(to, 0, item);
      return updated;
    });

    dragItemRef.current = null;
    dragOverRef.current = null;
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();

      for (const entry of files) {
        const buf = await entry.file.arrayBuffer();
        const src = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        for (const page of pages) {
          merged.addPage(page);
        }
      }

      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "merged.pdf" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed. Please try again.");
    } finally {
      setMerging(false);
    }
  }, [files]);

  const downloadResult = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  }, [result]);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFiles([]);
    setResult(null);
    setError(null);
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Drop zone for adding files */}
      {!result && (
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
            if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <div className="w-16 h-16 bg-neo-blue neo-border neo-shadow flex items-center justify-center">
            <Upload className="w-8 h-8 text-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-bold text-foreground">
            {files.length === 0 ? "Drop PDF files here" : "Add more PDF files"}
          </p>
          {files.length === 0 && (
            <>
              <p className="text-sm font-bold text-foreground/50">or</p>
              <button
                type="button"
                className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                Choose Files
              </button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* File list */}
      {files.length > 0 && !result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs font-bold text-foreground/40">
              Drag to reorder
            </p>
          </div>
          {files.map((entry, index) => (
            <div
              key={entry.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="neo-card bg-white p-4 flex items-center gap-3 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-foreground/30 flex-shrink-0" />
              <div className="w-10 h-10 bg-neo-pink neo-border flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{entry.file.name}</p>
                <p className="text-xs font-medium text-foreground/50">
                  {(entry.file.size / 1024).toFixed(1)} KB
                  {entry.pageCount !== null && ` -- ${entry.pageCount} page${entry.pageCount !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(entry.id)}
                className="neo-btn p-2 bg-white text-foreground/50 hover:text-neo-pink"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Merge button */}
      {files.length >= 2 && !result && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={merge}
            disabled={merging}
            className="neo-btn flex items-center gap-2 bg-neo-green text-foreground px-8 py-3 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {merging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Merging...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Merge {files.length} PDFs
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
            <p className="text-lg font-bold text-foreground">Merge Complete</p>
            <p className="text-sm font-medium text-foreground/60 mt-1">
              {files.length} files combined into one PDF
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
              Merge More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
