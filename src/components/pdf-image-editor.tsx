"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload, Download, FileText, Trash2, RotateCcw, Loader2, Move, ImagePlus,
} from "lucide-react";
import { ToolPageHeader } from "./tool-page-header";

interface PageRender {
  dataUrl: string;
  width: number;
  height: number;
}

interface PlacedImage {
  id: string;
  dataUrl: string;
  pageIndex: number;
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
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePageForAdd, setActivePageForAdd] = useState<number>(0);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const openPdfPicker = useCallback(() => { pdfInputRef.current?.click(); }, []);
  const openImgPicker = useCallback((pageIdx: number) => {
    setActivePageForAdd(pageIdx);
    setTimeout(() => imgInputRef.current?.click(), 0);
  }, []);

  const renderPages = useCallback(async (buf: ArrayBuffer): Promise<PageRender[]> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

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
      rendered.push({ dataUrl: canvas.toDataURL("image/png"), width: viewport.width, height: viewport.height });
    }
    return rendered;
  }, []);

  const loadPdf = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setPlacedImages([]);
    setDone(false);
    setError(null);
    setSelectedId(null);
    setPages([]);

    try {
      const buf = await file.arrayBuffer();
      // Copy buffer before PDF.js consumes/detaches the original
      const bufCopy = buf.slice(0);
      const rendered = await renderPages(buf);
      setPdfBytes(bufCopy);
      setPdfFile(file);
      setPages(rendered);
    } catch (err) {
      console.error("PDF load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load PDF.");
      setPdfFile(null);
      setPdfBytes(null);
    } finally {
      setLoading(false);
    }
  }, [renderPages]);

  const addImageToPage = useCallback(async (file: File, pageIndex: number) => {
    if (!file.type.startsWith("image/")) return;

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

    const defaultW = 0.3;
    const page = pages[pageIndex];
    const aspect = dims.h / dims.w;
    const defaultH = page ? (defaultW * (page.width / page.height)) * aspect : defaultW * aspect;

    const newImg: PlacedImage = {
      id: crypto.randomUUID(), dataUrl: url, pageIndex,
      x: 0.35, y: 0.35, w: defaultW, h: Math.min(defaultH, 0.5),
      naturalW: dims.w, naturalH: dims.h,
    };

    setPlacedImages((prev) => [...prev, newImg]);
    setSelectedId(newImg.id);
  }, [pages]);

  const updateImage = useCallback((id: string, updates: Partial<PlacedImage>) => {
    setPlacedImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...updates } : img)));
  }, []);

  const removeImage = useCallback((id: string) => {
    setPlacedImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const savePdf = useCallback(async () => {
    if (!pdfBytes || placedImages.length === 0) return;
    setSaving(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(new Uint8Array(pdfBytes), { ignoreEncryption: true });
      const pdfPages = pdf.getPages();

      for (const placed of placedImages) {
        const page = pdfPages[placed.pageIndex];
        if (!page) continue;
        const { width: pw, height: ph } = page.getSize();

        // Decode data URL to Uint8Array directly (no fetch)
        const base64 = placed.dataUrl.split(",")[1];
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        let image;
        const isPng = placed.dataUrl.startsWith("data:image/png");
        const isJpg = placed.dataUrl.startsWith("data:image/jpeg") || placed.dataUrl.startsWith("data:image/jpg");

        if (isPng) {
          image = await pdf.embedPng(bytes);
        } else if (isJpg) {
          image = await pdf.embedJpg(bytes);
        } else {
          // Convert any other format to PNG via canvas
          const blob = new Blob([bytes], { type: "image/png" });
          const bitmap = await createImageBitmap(blob);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
          const pngBuf = await new Promise<ArrayBuffer>((resolve) => {
            canvas.toBlob((b) => {
              b!.arrayBuffer().then(resolve);
            }, "image/png");
          });
          image = await pdf.embedPng(pngBuf);
        }

        const imgW = placed.w * pw;
        const imgH = placed.h * ph;
        const imgX = placed.x * pw;
        const imgY = ph - (placed.y * ph) - imgH;
        page.drawImage(image, { x: imgX, y: imgY, width: imgW, height: imgH });
      }

      const savedBytes = await pdf.save();
      const blob = new Blob([savedBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFile ? pdfFile.name.replace(/\.pdf$/i, "-edited.pdf") : "edited.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // Reset to idle immediately -- download is already triggered
      setSaving(false);
      setPdfFile(null); setPdfBytes(null); setPages([]); setPlacedImages([]);
      setSelectedId(null); setDone(true);

      // Cleanup download link after browser picks it up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 3000);
      return;
    } catch (err) {
      console.error("Save PDF error:", err);
      setError(err instanceof Error ? err.message : "Failed to save PDF.");
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfBytes, placedImages, pdfFile]);

  const reset = useCallback(() => {
    setPdfFile(null); setPdfBytes(null); setPages([]); setPlacedImages([]);
    setDone(false); setError(null); setSelectedId(null);
  }, []);

  const hasEdits = placedImages.length > 0;
  const isIdle = !pdfFile && !loading;
  const selectedImage = placedImages.find((img) => img.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      {/* Hidden inputs -- always in DOM */}
      <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadPdf(f); e.target.value = ""; }} />
      <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) addImageToPage(f, activePageForAdd); e.target.value = ""; }} />

      {/* Hero -- only when idle */}
      {isIdle && (
        <ToolPageHeader
          title="Add Images to PDF"
          description="Upload a PDF, then drag & drop images onto any page. Position and resize them anywhere you want."
          tag="VISUAL EDITOR"
          tagColor="#FF914D"
        />
      )}

      {/* Success after download */}
      {done && (
        <div className="neo-card bg-neo-green p-5 text-center">
          <p className="text-sm font-bold text-foreground">PDF downloaded successfully. Upload another file to continue.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="neo-card bg-neo-yellow p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-foreground animate-spin" />
          <p className="text-sm font-bold text-foreground">Rendering PDF pages...</p>
        </div>
      )}

      {/* Upload PDF zone */}
      {isIdle && (
        <div
          role="button" tabIndex={0}
          className={`neo-card p-8 sm:p-12 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-100 ${
            isDragOver ? "bg-neo-yellow translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#1a1a1a]" : "bg-white"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadPdf(f); }}
          onClick={openPdfPicker}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openPdfPicker(); }}
        >
          <div className="w-16 h-16 bg-neo-orange neo-border neo-shadow flex items-center justify-center">
            <FileText className="w-8 h-8 text-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-bold text-foreground">Drop your PDF here</p>
          <p className="text-sm font-bold text-foreground/50">or</p>
          <button type="button" className="neo-btn bg-neo-pink text-white px-8 py-3 rounded-lg text-sm font-bold"
            onClick={(e) => { e.stopPropagation(); openPdfPicker(); }}>
            Choose PDF
          </button>
        </div>
      )}

      {/* Page editor */}
      {pages.length > 0 && (
        <div className="space-y-6">
          <div className="neo-card bg-white p-4 overflow-hidden">
            {/* File info bar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-sm font-bold text-foreground truncate min-w-0">
                {pdfFile?.name} -- {pages.length} page{pages.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs font-bold text-foreground/40 flex-shrink-0 whitespace-nowrap">
                Drop images onto pages
              </p>
            </div>

            <div className="space-y-8">
              {pages.map((page, pageIdx) => {
                const pageImages = placedImages.filter((img) => img.pageIndex === pageIdx);
                return (
                  <div key={pageIdx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground/50">Page {pageIdx + 1}</p>
                      <button type="button" onClick={() => openImgPicker(pageIdx)}
                        className="neo-btn flex items-center gap-1.5 bg-neo-orange text-foreground px-3 py-1.5 rounded-md text-xs font-bold">
                        <ImagePlus className="w-3.5 h-3.5" /> Add Image
                      </button>
                    </div>

                    <PageCanvas
                      page={page} images={pageImages} selectedId={selectedId}
                      onSelect={setSelectedId}
                      onImageUpdate={updateImage}
                      onImageDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const file = e.dataTransfer.files[0];
                        if (file?.type.startsWith("image/")) addImageToPage(file, pageIdx);
                      }}
                      onRemoveImage={removeImage}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected image edit panel */}
          {selectedImage && (
            <div className="neo-card bg-neo-yellow p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Image Settings -- Page {selectedImage.pageIndex + 1}
                </p>
                <button type="button" onClick={() => removeImage(selectedImage.id)}
                  className="neo-btn flex items-center gap-1 bg-neo-pink text-white px-2.5 py-1 rounded-md text-xs font-bold">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-foreground/60 block mb-1">X Position</label>
                  <input type="range" min={0} max={100} value={Math.round(selectedImage.x * 100)}
                    onChange={(e) => updateImage(selectedImage.id, { x: Number(e.target.value) / 100 })}
                    className="w-full" />
                  <span className="text-[11px] font-bold text-foreground tabular-nums">{Math.round(selectedImage.x * 100)}%</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-foreground/60 block mb-1">Y Position</label>
                  <input type="range" min={0} max={100} value={Math.round(selectedImage.y * 100)}
                    onChange={(e) => updateImage(selectedImage.id, { y: Number(e.target.value) / 100 })}
                    className="w-full" />
                  <span className="text-[11px] font-bold text-foreground tabular-nums">{Math.round(selectedImage.y * 100)}%</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-foreground/60 block mb-1">Width</label>
                  <input type="range" min={5} max={100} value={Math.round(selectedImage.w * 100)}
                    onChange={(e) => {
                      const newW = Number(e.target.value) / 100;
                      const page = pages[selectedImage.pageIndex];
                      const aspect = selectedImage.naturalH / selectedImage.naturalW;
                      const pageAspect = page ? page.width / page.height : 1;
                      const newH = newW * aspect * pageAspect;
                      updateImage(selectedImage.id, { w: newW, h: Math.min(newH, 1) });
                    }}
                    className="w-full" />
                  <span className="text-[11px] font-bold text-foreground tabular-nums">{Math.round(selectedImage.w * 100)}%</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-foreground/60 block mb-1">Height</label>
                  <input type="range" min={3} max={100} value={Math.round(selectedImage.h * 100)}
                    onChange={(e) => updateImage(selectedImage.id, { h: Number(e.target.value) / 100 })}
                    className="w-full" />
                  <span className="text-[11px] font-bold text-foreground tabular-nums">{Math.round(selectedImage.h * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="flex justify-center gap-3">
            <button type="button" onClick={savePdf} disabled={saving || !hasEdits}
              className="neo-btn flex items-center gap-2 bg-neo-green text-foreground px-8 py-3 rounded-lg text-sm font-bold disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Download className="w-4 h-4" /> Download PDF</>}
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
    </div>
  );
}

// ── Page canvas with draggable image overlays ──

function PageCanvas({ page, images, selectedId, onSelect, onImageUpdate, onImageDrop, onRemoveImage }: {
  page: PageRender; images: PlacedImage[]; selectedId: string | null;
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
      onClick={(e) => { if (!(e.target as HTMLElement).dataset.overlay) onSelect(null); }}
    >
      <img src={page.dataUrl} alt="" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />

      {images.map((img) => (
        <DraggableImage key={img.id} image={img} isSelected={selectedId === img.id} containerRef={containerRef}
          onSelect={() => onSelect(img.id)} onUpdate={(u) => onImageUpdate(img.id, u)} onRemove={() => onRemoveImage(img.id)} />
      ))}

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

function DraggableImage({ image, isSelected, containerRef, onSelect, onUpdate, onRemove }: {
  image: PlacedImage; isSelected: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void; onUpdate: (u: Partial<PlacedImage>) => void; onRemove: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const startRef = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });

  const getSize = useCallback(() => {
    const el = containerRef.current;
    return el ? { cw: el.offsetWidth, ch: el.offsetHeight } : { cw: 1, ch: 1 };
  }, [containerRef]);

  const onDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation(); onSelect(); setDragging(true);
    startRef.current = { mx: e.clientX, my: e.clientY, x: image.x, y: image.y, w: image.w, h: image.h };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [image.x, image.y, image.w, image.h, onSelect]);

  const onResizeDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation(); setResizing(true);
    startRef.current = { mx: e.clientX, my: e.clientY, x: image.x, y: image.y, w: image.w, h: image.h };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [image.x, image.y, image.w, image.h]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const { cw, ch } = getSize(); const s = startRef.current;
    if (dragging) {
      onUpdate({ x: Math.max(0, Math.min(1 - s.w, s.x + (e.clientX - s.mx) / cw)), y: Math.max(0, Math.min(1 - s.h, s.y + (e.clientY - s.my) / ch)) });
    } else if (resizing) {
      const newW = Math.max(0.05, Math.min(1 - s.x, s.w + (e.clientX - s.mx) / cw));
      const aspect = image.naturalH / image.naturalW;
      onUpdate({ w: newW, h: Math.max(0.03, Math.min(1 - s.y, newW * aspect * (cw / ch))) });
    }
  }, [dragging, resizing, getSize, onUpdate, image.naturalW, image.naturalH]);

  const onUp = useCallback(() => { setDragging(false); setResizing(false); }, []);

  return (
    <div data-overlay="true" className={`absolute ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ left: `${image.x * 100}%`, top: `${image.y * 100}%`, width: `${image.w * 100}%`, height: `${image.h * 100}%` }}
      onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className={`w-full h-full relative ${isSelected ? "ring-2 ring-foreground" : ""}`}
        style={{ outline: isSelected ? "none" : "2px dashed rgba(26,26,26,0.3)" }}>
        <img data-overlay="true" src={image.dataUrl} alt="" className="w-full h-full object-contain select-none" draggable={false} onPointerDown={onDown} />

        {isSelected && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-3 -right-3 w-6 h-6 bg-neo-pink neo-border flex items-center justify-center z-10">
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        )}
        {isSelected && (
          <div data-overlay="true" className="absolute -bottom-2 -right-2 w-5 h-5 bg-neo-yellow neo-border cursor-se-resize z-10 flex items-center justify-center"
            onPointerDown={onResizeDown}>
            <Move className="w-3 h-3 text-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
