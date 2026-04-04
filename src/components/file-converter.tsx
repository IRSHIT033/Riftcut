"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, FileText, Image, RotateCcw, Loader2 } from "lucide-react";

type ConvertMode = "image-to-pdf" | "word-to-pdf";

interface ConvertedFile {
  name: string;
  url: string;
}

export function FileConverter() {
  const [mode, setMode] = useState<ConvertMode>("image-to-pdf");
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<ConvertedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = mode === "image-to-pdf"
    ? "image/jpeg,image/png,image/webp,image/gif,image/bmp"
    : ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);

  const handleFile = useCallback(
    (f: File) => {
      reset();
      setFile(f);
    },
    [reset]
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = "";
    },
    [handleFile]
  );

  const convert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setError(null);

    try {
      if (mode === "image-to-pdf") {
        const { PDFDocument } = await import("pdf-lib");
        const arrayBuf = await file.arrayBuffer();
        const pdf = await PDFDocument.create();

        let image;
        const type = file.type;
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

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const baseName = file.name.replace(/\.[^.]+$/, "");
        setResult({ name: `${baseName}.pdf`, url });
      } else {
        const mammoth = await import("mammoth");
        const arrayBuf = await file.arrayBuffer();
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer: arrayBuf });

        const { PDFDocument, rgb } = await import("pdf-lib");
        const pdf = await PDFDocument.create();

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const textContent = tempDiv.innerText || tempDiv.textContent || "";
        const lines = textContent.split("\n");

        const PAGE_W = 595.28;
        const PAGE_H = 841.89;
        const MARGIN = 50;
        const FONT_SIZE = 11;
        const LINE_HEIGHT = FONT_SIZE * 1.6;
        const maxCharsPerLine = Math.floor((PAGE_W - 2 * MARGIN) / (FONT_SIZE * 0.52));

        const font = await pdf.embedFont("Helvetica" as any);

        const wrappedLines: string[] = [];
        for (const line of lines) {
          if (line.length === 0) {
            wrappedLines.push("");
            continue;
          }
          let remaining = line;
          while (remaining.length > maxCharsPerLine) {
            let breakIdx = remaining.lastIndexOf(" ", maxCharsPerLine);
            if (breakIdx <= 0) breakIdx = maxCharsPerLine;
            wrappedLines.push(remaining.substring(0, breakIdx));
            remaining = remaining.substring(breakIdx).trimStart();
          }
          wrappedLines.push(remaining);
        }

        const linesPerPage = Math.floor((PAGE_H - 2 * MARGIN) / LINE_HEIGHT);
        const totalPages = Math.ceil(wrappedLines.length / linesPerPage);

        for (let p = 0; p < Math.max(1, totalPages); p++) {
          const page = pdf.addPage([PAGE_W, PAGE_H]);
          const pageLines = wrappedLines.slice(p * linesPerPage, (p + 1) * linesPerPage);

          for (let i = 0; i < pageLines.length; i++) {
            const text = pageLines[i];
            if (!text) continue;
            page.drawText(text, {
              x: MARGIN,
              y: PAGE_H - MARGIN - (i + 1) * LINE_HEIGHT,
              size: FONT_SIZE,
              font,
              color: rgb(0, 0, 0),
            });
          }
        }

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const baseName = file.name.replace(/\.[^.]+$/, "");
        setResult({ name: `${baseName}.pdf`, url });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  }, [file, mode]);

  const downloadResult = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Single file input -- always in the DOM */}
      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes}
        className="hidden"
        onChange={onInputChange}
      />

      {/* Mode selector */}
      <div className="flex items-center gap-3 justify-center flex-wrap">
        <button
          type="button"
          onClick={() => { setMode("image-to-pdf"); reset(); }}
          className={`neo-btn flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold ${
            mode === "image-to-pdf" ? "bg-neo-yellow text-foreground" : "bg-white text-foreground"
          }`}
        >
          <Image className="w-4 h-4" />
          Image to PDF
        </button>
        <button
          type="button"
          onClick={() => { setMode("word-to-pdf"); reset(); }}
          className={`neo-btn flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold ${
            mode === "word-to-pdf" ? "bg-neo-yellow text-foreground" : "bg-white text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Word to PDF
        </button>
      </div>

      {/* Upload zone */}
      {!result && (
        <div
          role="button"
          tabIndex={0}
          className={`neo-card p-10 sm:p-14 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-100 ${
            isDragOver
              ? "bg-neo-yellow translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#1a1a1a]"
              : "bg-white"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openFilePicker();
          }}
        >
          <div className="w-16 h-16 bg-neo-blue neo-border neo-shadow flex items-center justify-center">
            <Upload className="w-8 h-8 text-foreground" strokeWidth={2.5} />
          </div>

          {file ? (
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{file.name}</p>
              <p className="text-sm font-medium text-foreground/50 mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <>
              <p className="text-xl font-bold text-foreground">
                Drop your {mode === "image-to-pdf" ? "image" : "Word document"} here
              </p>
              <p className="text-sm font-bold text-foreground/50">or</p>
              <button
                type="button"
                className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
                onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
              >
                Choose File
              </button>
              <p className="text-xs font-bold text-foreground/40 mt-1">
                {mode === "image-to-pdf"
                  ? "Supports JPG, PNG, WebP, GIF, BMP"
                  : "Supports .doc and .docx files"}
              </p>
            </>
          )}
        </div>
      )}

      {/* Convert button */}
      {file && !result && (
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
                Convert to PDF
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

      {/* Preview + Download */}
      {result && (
        <div className="space-y-5">
          <div className="neo-card bg-white overflow-hidden">
            <div className="bg-neo-green border-b-3 border-foreground px-4 py-3">
              <p className="text-sm font-bold text-foreground">
                Preview -- {result.name}
              </p>
            </div>
            <div className="w-full" style={{ height: "70vh" }}>
              <iframe
                src={result.url}
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
              onClick={reset}
              className="neo-btn flex items-center gap-2 bg-neo-yellow text-foreground px-5 py-3 rounded-lg text-sm font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
