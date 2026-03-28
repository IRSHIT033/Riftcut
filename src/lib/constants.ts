import type { AspectRatioPreset, DownloadSizePreset } from "./types";

export const ASPECT_RATIOS: AspectRatioPreset[] = [
  { label: "Original", value: "original", ratio: null },
  { label: "1:1", value: "1:1", ratio: 1 },
  { label: "4:3", value: "4:3", ratio: 4 / 3 },
  { label: "3:2", value: "3:2", ratio: 3 / 2 },
  { label: "16:9", value: "16:9", ratio: 16 / 9 },
  { label: "9:16", value: "9:16", ratio: 9 / 16 },
  { label: "4:5", value: "4:5", ratio: 4 / 5 },
];

export const DOWNLOAD_SIZES: DownloadSizePreset[] = [
  { label: "Original", maxDim: Infinity },
  { label: "Large (1920px)", maxDim: 1920 },
  { label: "Medium (1280px)", maxDim: 1280 },
  { label: "Small (640px)", maxDim: 640 },
  { label: "Thumbnail (320px)", maxDim: 320 },
];

export const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Yellow", value: "#eab308" },
  { label: "Pink", value: "#ec4899" },
  { label: "Orange", value: "#f97316" },
];

export const PROCESSING_MESSAGES = [
  "Analyzing image composition...",
  "Separating foreground elements...",
  "Refining edge detection...",
  "Applying neural network inference...",
  "Fine-tuning the segmentation mask...",
  "Almost there, perfecting the edges...",
  "Running pixel-level analysis...",
  "Isolating the subject precisely...",
  "Background identified, removing now...",
  "Cleaning up the final details...",
  "Working some AI magic...",
  "Your background won't know what hit it...",
  "Precision-cutting every pixel...",
  "The AI is deep in thought...",
  "Foreground locked, background targeted...",
];

export const MAX_DIM_MOBILE = 1024;
export const MAX_DIM_DESKTOP = 2048;
