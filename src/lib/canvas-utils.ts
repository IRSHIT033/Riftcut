import type { MaskInfo, BackgroundConfig, ImageFilters, CropRect, TextOverlay, BackdropSettings } from "./types";
import { DEFAULT_BACKDROP } from "./types";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function applyMask(
  originalSrc: string,
  maskInfo: MaskInfo
): Promise<string> {
  const img = await loadImage(originalSrc);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const mask = maskInfo.data;
  const maskChannels = maskInfo.channels || 1;

  for (let i = 0; i < pixels.length / 4; i++) {
    pixels[i * 4 + 3] = mask[i * maskChannels];
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export async function compositeBackground(
  foregroundDataUrl: string,
  background: BackgroundConfig,
  width: number,
  height: number
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  if (background.type === "color") {
    ctx.fillStyle = background.color;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === "image") {
    const bd = background.backdrop ?? DEFAULT_BACKDROP;
    const bgImg = await loadImage(background.imageDataUrl);

    // Build CSS filter string for backdrop effects
    const filters: string[] = [];
    if (bd.blur > 0) filters.push(`blur(${bd.blur}px)`);
    if (bd.brightness !== 100) filters.push(`brightness(${bd.brightness / 100})`);
    if (bd.grayscale) filters.push("grayscale(1)");
    if (bd.opacity < 100) ctx.globalAlpha = bd.opacity / 100;
    if (filters.length > 0) ctx.filter = filters.join(" ");

    // Scale from center
    if (bd.scale !== 100) {
      const s = bd.scale / 100;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(s, s);
      ctx.translate(-width / 2, -height / 2);
      drawCover(ctx, bgImg, width, height);
      ctx.restore();
    } else {
      drawCover(ctx, bgImg, width, height);
    }

    // Reset filter and alpha
    ctx.filter = "none";
    ctx.globalAlpha = 1;
  }
  // For 'transparent', canvas is already clear

  const fgImg = await loadImage(foregroundDataUrl);
  ctx.drawImage(fgImg, 0, 0, width, height);

  return canvas.toDataURL("image/png");
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetW: number,
  targetH: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = targetW / targetH;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;

  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
}

export function cropToAspectRatio(
  dataUrl: string,
  targetRatio: number
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const sourceRatio = img.width / img.height;
      let cropW = img.width;
      let cropH = img.height;
      let cropX = 0;
      let cropY = 0;

      if (sourceRatio > targetRatio) {
        cropW = Math.round(img.height * targetRatio);
        cropX = Math.round((img.width - cropW) / 2);
      } else {
        cropH = Math.round(img.width / targetRatio);
        cropY = Math.round((img.height - cropH) / 2);
      }

      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = dataUrl;
  });
}

export async function resizeImage(
  dataUrl: string,
  maxDim: number
): Promise<string> {
  const img = await loadImage(dataUrl);
  if (maxDim === Infinity || (img.width <= maxDim && img.height <= maxDim)) {
    return dataUrl;
  }
  const scale = maxDim / Math.max(img.width, img.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

export function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
}

export function downloadPNG(
  dataUrl: string,
  filename = "background-removed.png"
) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function downscaleIfNeeded(
  dataUrl: string,
  maxDim: number
): Promise<string> {
  const img = await loadImage(dataUrl);
  if (img.width <= maxDim && img.height <= maxDim) {
    return dataUrl;
  }
  const scale = maxDim / Math.max(img.width, img.height);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

export async function applyImageFilters(
  dataUrl: string,
  filters: ImageFilters
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;

  const br = filters.brightness / 100;
  const co = filters.contrast / 100;
  const sa = filters.saturation / 100;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];

    // Brightness
    if (br !== 1) { r *= br; g *= br; b *= br; }

    // Contrast (around 128 midpoint)
    if (co !== 1) {
      r = (r - 128) * co + 128;
      g = (g - 128) * co + 128;
      b = (b - 128) * co + 128;
    }

    // Saturation (luminance-preserving)
    if (sa !== 1) {
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = gray + sa * (r - gray);
      g = gray + sa * (g - gray);
      b = gray + sa * (b - gray);
    }

    // Grayscale
    if (filters.grayscale) {
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = g = b = gray;
    }

    d[i] = Math.max(0, Math.min(255, r));
    d[i + 1] = Math.max(0, Math.min(255, g));
    d[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export async function applyCrop(
  dataUrl: string,
  crop: CropRect
): Promise<string> {
  const img = await loadImage(dataUrl);
  const sx = Math.round(crop.x * img.width);
  const sy = Math.round(crop.y * img.height);
  const sw = Math.round(crop.w * img.width);
  const sh = Math.round(crop.h * img.height);
  if (sw <= 0 || sh <= 0) return dataUrl;
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL("image/png");
}

const loadedFonts = new Set<string>();

async function ensureGoogleFont(fontFamily: string): Promise<void> {
  if (loadedFonts.has(fontFamily)) return;
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
  try {
    await document.fonts.load(`16px "${fontFamily}"`);
  } catch {
    // Font may still render with fallback
  }
  loadedFonts.add(fontFamily);
}

export async function applyTextOverlays(
  dataUrl: string,
  overlays: TextOverlay[]
): Promise<string> {
  if (overlays.length === 0) return dataUrl;
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  for (const overlay of overlays) {
    if (!overlay.text.trim()) continue;

    await ensureGoogleFont(overlay.fontFamily);

    const pxSize = Math.round((overlay.fontSize / 100) * img.height);
    const weight = overlay.bold ? "bold" : "normal";
    const style = overlay.italic ? "italic" : "normal";
    ctx.font = `${style} ${weight} ${pxSize}px "${overlay.fontFamily}"`;
    ctx.fillStyle = overlay.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const x = overlay.x * img.width;
    const y = overlay.y * img.height;

    // Draw outline if set
    if (overlay.strokeColor && overlay.strokeColor !== "none") {
      ctx.strokeStyle = overlay.strokeColor;
      ctx.lineWidth = Math.max(1, pxSize / 12);
      ctx.lineJoin = "round";
      ctx.strokeText(overlay.text, x, y);
    }
    ctx.fillText(overlay.text, x, y);
  }

  return canvas.toDataURL("image/png");
}

export function generateThumbnail(dataUrl: string, size = 64): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const scale = size / Math.max(img.width, img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = dataUrl;
  });
}
