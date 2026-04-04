"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload, Download, FileText, Trash2, RotateCcw, Loader2, Plus, Move, ImagePlus,
} from "lucide-react";

interface PageRender {
  dataUrl: string;
  width: number;
  height: number;
}

interface PlacedImage {
  id: string;
  dataUrl: string;
  pageIndex: number;
  // Position as fraction of page dimensions (0-1)
  x: number;
  y: number;
  w: number;
  h: number;
  naturalW: number;
  naturalH: number;
}

export function PdfImageEditor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageRender[]>([]);
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [activePageForAdd, setActivePageForAdd] = useState<number>(0);

  // Load PDF and render pages
  const loadPdf = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setPlacedImages([]);
    setPreviewUrl(null);
    setSelectedId(null);

    try {
      const buf = await file.arrayBuffer();
      setPdfBytes(buf);
      setPdfFile(file);

      // Dynamically import PDF.js
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buf) });
      const pdf = await loadingTask.promise;

      const rendered: PageRender[] = [];
      const scale = 1.5;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        rendered.push({
          dataUrl: canvas.toDataURL("image/png"),
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(rendered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDF.");
      setPdfFile(null);
      setPdfBytes(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add image to a specific page
  const addImageToPage = useCallback(async (file: File, pageIndex: number) => {
    const url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 200, h: 200 });
      img.src = url;
    });

    // Default size: 30% of page width, maintain aspect ratio
    const defaultW = 0.3;
    const aspect = dims.h / dims.w;
    const page = pages[pageIndex];
    const defaultH = page ? (defaultW * (page.width / page.height)) * aspect : defaultW * aspect;

    setPlacedImages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        dataUrl: url,
        pageIndex,
        x: 0.35,
        y: 0.35,
        w: defaultW,
        h: Math.min(defaultH, 0.5),
        naturalW: dims.w,
        naturalH: dims.h,
      },
    ]);
  }, [pages]);

  // Handle image file drop on a page
  const handleImageDrop = useCallback(
    (e: React.DragEvent, pageIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        addImageToPage(file, pageIndex);
      }
    },
    [addImageToPage]
  );

  const removeImage = useCallback((id: string) => {
    setPlacedImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  // Save: embed images into PDF using pdf-lib
  const savePdf = useCallback(async () => {
    if (!pdfBytes || placedImages.length === 0) return;
    setSaving(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pdfPages = pdf.getPages();

      for (const placed of placedImages) {
        const page = pdfPages[placed.pageIndex];
        if (!page) continue;

        const { width: pw, height: ph } = page.getSize();

        // Fetch image data
        const response = await fetch(placed.dataUrl);
        const imgBuf = await response.arrayBuffer();

        let image;
        if (placed.dataUrl.includes("image/png")) {
          image = await pdf.embedPng(imgBuf);
        } else {
          // Convert to PNG if needed
          try {
            image = await pdf.embedJpg(imgBuf);
          } catch {
            image = await pdf.embedPng(imgBuf);
          }
        }

        // Convert fractional coords to PDF coords
        // PDF origin is bottom-left, our coords are top-left
        const imgW = placed.w * pw;
        const imgH = placed.h * ph;
        const imgX = placed.x * pw;
        const imgY = ph - (placed.y * ph) - imgH; // flip Y

        page.drawImage(image, { x: imgX, y: imgY, width: imgW, height: imgH });
      }

      const savedBytes = await pdf.save();
      const blob = new Blob([savedBytes as BlobPart], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save PDF.");
    } finally {
      setSaving(false);
    }
  }, [pdfBytes, placedImages, previewUrl]);

  const downloadResult = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = pdfFile ? pdfFile.name.replace(/\.pdf$/i, "-edited.pdf") : "edited.pdf";
    a.click();
  }, [previewUrl, pdfFile]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPdfFile(null);
    setPdfBytes(null);
    setPages([]);
    setPlacedImages([]);
    setPreviewUrl(null);
    setError(null);
    setSelectedId(null);
  }, [previewUrl]);

  const backToEdit = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  const isPreview = !!previewUrl;
  const hasEdits = placedImages.length > 0;

  return (
    <div className="space-y-6">
      {/* Hidden inputs - always mounted */}
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) loadPdf(f);
          e.target.value = "";
        }}
      />
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) addImageToPage(f, activePageForAdd);
          e.target.value = "";
        }}
      />

      {/* Loading */}
      {loading && (
        <div className="neo-card bg-neo-yellow p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-foreground animate-spin" />
          <p className="text-sm font-bold text-foreground">Rendering PDF pages...</p>
        </div>
      )}

      {/* Upload PDF zone */}
      {!pdfFile && !loading && !isPreview && (
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
            const f = e.dataTransfer.files[0];
            if (f) loadPdf(f);
          }}
          onClick={() => pdfInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") pdfInputRef.current?.click(); }}
        >
          <div className="w-16 h-16 bg-neo-orange neo-border neo-shadow flex items-center justify-center">
            <FileText className="w-8 h-8 text-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-bold text-foreground">Drop your PDF here</p>
          <p className="text-sm font-bold text-foreground/50">or</p>
          <button
            type="button"
            className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
            onClick={(e) => { e.stopPropagation(); pdfInputRef.current?.click(); }}
          >
            Choose PDF
          </button>
        </div>
      )}

      {/* Page editor */}
      {pages.length > 0 && !isPreview && (
        <div className="space-y-6">
          <div className="neo-card bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-foreground">
                {pdfFile?.name} -- {pages.length} page{pages.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs font-bold text-foreground/40">
                Drop images onto any page
              </p>
            </div>

            <div className="space-y-8">
              {pages.map((page, pageIdx) => {
                const pageImages = placedImages.filter((img) => img.pageIndex === pageIdx);
                return (
                  <div key={pageIdx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground/50">Page {pageIdx + 1}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePageForAdd(pageIdx);
                          imgInputRef.current?.click();
                        }}
                        className="neo-btn flex items-center gap-1.5 bg-neo-orange text-foreground px-3 py-1.5 rounded-md text-xs font-bold"
                      >
                        <ImagePlus className="w-3.5 h-3.5" />
                        Add Image
                      </button>
                    </div>

                    <PageCanvas
                      page={page}
                      images={pageImages}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      onImageUpdate={(id, updates) => {
                        setPlacedImages((prev) =>
                          prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
                        );
                      }}
                      onImageDrop={(e) => handleImageDrop(e, pageIdx)}
                      onRemoveImage={removeImage}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action bar */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={savePdf}
              disabled={saving || !hasEdits}
              className="neo-btn flex items-center gap-2 bg-neo-green text-foreground px-8 py-3 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Download className="w-4 h-4" /> Save & Preview</>
              )}
            </button>
            <button type="button" onClick={reset} className="neo-btn bg-white text-foreground px-5 py-3 rounded-lg text-sm font-bold">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {!hasEdits && (
            <p className="text-center text-sm font-bold text-foreground/40">
              Add at least one image to a page to save
            </p>
          )}
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
                Preview -- {placedImages.length} image{placedImages.length !== 1 ? "s" : ""} added
              </p>
            </div>
            <div className="w-full" style={{ height: "70vh" }}>
              <iframe src={previewUrl!} title="PDF preview" className="w-full h-full border-0" />
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
              onClick={backToEdit}
              className="neo-btn flex items-center gap-2 bg-white text-foreground px-5 py-3 rounded-lg text-sm font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              Back to Edit
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

// ── Page canvas with draggable image overlays ──

function PageCanvas({
  page,
  images,
  selectedId,
  onSelect,
  onImageUpdate,
  onImageDrop,
  onRemoveImage,
}: {
  page: PageRender;
  images: PlacedImage[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onImageUpdate: (id: string, updates: Partial<PlacedImage>) => void;
  onImageDrop: (e: React.DragEvent) => void;
  onRemoveImage: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative neo-border bg-white overflow-hidden mx-auto"
      style={{ maxWidth: page.width, aspectRatio: `${page.width}/${page.height}` }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onImageDrop}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "IMG" && !(e.target as HTMLElement).dataset.overlay) {
          onSelect(null);
        }
      }}
    >
      {/* PDF page background */}
      <img src={page.dataUrl} alt="" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />

      {/* Placed images */}
      {images.map((img) => (
        <DraggableImage
          key={img.id}
          image={img}
          isSelected={selectedId === img.id}
          containerRef={containerRef}
          onSelect={() => onSelect(img.id)}
          onUpdate={(updates) => onImageUpdate(img.id, updates)}
          onRemove={() => onRemoveImage(img.id)}
        />
      ))}

      {/* Drop hint when empty */}
      {images.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-foreground/5 border-2 border-dashed border-foreground/20 rounded-lg px-4 py-3">
            <p className="text-xs font-bold text-foreground/30">Drop images here</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Draggable + resizable image overlay ──

function DraggableImage({
  image,
  isSelected,
  containerRef,
  onSelect,
  onUpdate,
  onRemove,
}: {
  image: PlacedImage;
  isSelected: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onUpdate: (updates: Partial<PlacedImage>) => void;
  onRemove: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const startRef = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });

  const getContainerSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { cw: 1, ch: 1 };
    return { cw: el.offsetWidth, ch: el.offsetHeight };
  }, [containerRef]);

  const onPointerDownMove = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect();
      setDragging(true);
      startRef.current = { mx: e.clientX, my: e.clientY, x: image.x, y: image.y, w: image.w, h: image.h };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [image.x, image.y, image.w, image.h, onSelect]
  );

  const onPointerDownResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizing(true);
      startRef.current = { mx: e.clientX, my: e.clientY, x: image.x, y: image.y, w: image.w, h: image.h };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [image.x, image.y, image.w, image.h]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const { cw, ch } = getContainerSize();
      const s = startRef.current;

      if (dragging) {
        const dx = (e.clientX - s.mx) / cw;
        const dy = (e.clientY - s.my) / ch;
        onUpdate({
          x: Math.max(0, Math.min(1 - s.w, s.x + dx)),
          y: Math.max(0, Math.min(1 - s.h, s.y + dy)),
        });
      } else if (resizing) {
        const dx = (e.clientX - s.mx) / cw;
        const dy = (e.clientY - s.my) / ch;
        const newW = Math.max(0.05, Math.min(1 - s.x, s.w + dx));
        // Maintain aspect ratio
        const aspect = image.naturalH / image.naturalW;
        const pageAspect = cw / ch;
        const newH = newW * aspect * pageAspect;
        onUpdate({ w: newW, h: Math.max(0.03, Math.min(1 - s.y, newH)) });
      }
    },
    [dragging, resizing, getContainerSize, onUpdate, image.naturalW, image.naturalH]
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
    setResizing(false);
  }, []);

  return (
    <div
      data-overlay="true"
      className={`absolute ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `${image.x * 100}%`,
        top: `${image.y * 100}%`,
        width: `${image.w * 100}%`,
        height: `${image.h * 100}%`,
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className={`w-full h-full relative ${isSelected ? "ring-2 ring-foreground" : ""}`}
        style={{ outline: isSelected ? "none" : "2px dashed rgba(26,26,26,0.3)" }}
      >
        <img
          data-overlay="true"
          src={image.dataUrl}
          alt=""
          className="w-full h-full object-contain select-none"
          draggable={false}
          onPointerDown={onPointerDownMove}
        />

        {/* Delete button */}
        {isSelected && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-3 -right-3 w-6 h-6 bg-neo-pink neo-border flex items-center justify-center z-10"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        )}

        {/* Resize handle */}
        {isSelected && (
          <div
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-neo-yellow neo-border cursor-se-resize z-10 flex items-center justify-center"
            onPointerDown={onPointerDownResize}
          >
            <Move className="w-3 h-3 text-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
