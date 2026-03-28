export function extractDominantColor(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 50;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const buckets = new Map<
        number,
        { count: number; r: number; g: number; b: number }
      >();

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2],
          a = data[i + 3];
        if (a < 128) continue;
        // Skip near-white and near-black
        if (r > 240 && g > 240 && b > 240) continue;
        if (r < 15 && g < 15 && b < 15) continue;

        const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
        const bucket = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
        bucket.count++;
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
        buckets.set(key, bucket);
      }

      let best = { count: 0, r: 128, g: 128, b: 128 };
      for (const bucket of buckets.values()) {
        if (bucket.count > best.count) best = bucket;
      }

      if (best.count === 0) {
        resolve("#808080");
        return;
      }

      const hex = rgbToHex(
        Math.round(best.r / best.count),
        Math.round(best.g / best.count),
        Math.round(best.b / best.count)
      );
      resolve(hex);
    };
    img.src = imageDataUrl;
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}
