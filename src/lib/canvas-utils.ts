import type { MaskInfo, BackgroundConfig, ImageFilters, CropRect } from "./types";

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
    const bgImg = await loadImage(background.imageDataUrl);
    drawCover(ctx, bgImg, width, height);
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

  const parts: string[] = [];
  if (filters.grayscale) parts.push("grayscale(1)");
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness / 100})`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast / 100})`);
  if (filters.saturation !== 100) parts.push(`saturate(${filters.saturation / 100})`);

  if (parts.length > 0) {
    ctx.filter = parts.join(" ");
  }

  ctx.drawImage(img, 0, 0);
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
