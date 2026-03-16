/**
 * Apply a segmentation mask to the original image, producing a transparent-background PNG.
 *
 * @param {string} originalSrc - Data URL of the original image
 * @param {object} maskInfo - { data: Uint8Array, width: number, height: number, channels: number }
 * @returns {Promise<string>} - Data URL of the result image with transparent background
 */
export async function applyMask(originalSrc, maskInfo) {
  const img = await loadImage(originalSrc);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Apply mask as alpha channel
  const mask = maskInfo.data;
  const maskChannels = maskInfo.channels || 1;

  for (let i = 0; i < pixels.length / 4; i++) {
    // Use the first channel of the mask as alpha
    const maskValue = mask[i * maskChannels];
    pixels[i * 4 + 3] = maskValue; // Set alpha
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png');
}

/**
 * Download a data URL as a PNG file.
 *
 * @param {string} dataUrl - The image data URL to download
 * @param {string} [filename='background-removed.png'] - The filename for the download
 */
export function downloadPNG(dataUrl, filename = 'background-removed.png') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Load an image from a source URL.
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
