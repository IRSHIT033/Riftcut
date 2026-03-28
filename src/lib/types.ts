export interface MaskInfo {
  data: Uint8Array;
  width: number;
  height: number;
  channels: number;
}

export interface AspectRatioPreset {
  label: string;
  value: string;
  ratio: number | null; // null = original
}

export interface DownloadSizePreset {
  label: string;
  maxDim: number; // Infinity = original
}

export type BackgroundConfig =
  | { type: "transparent" }
  | { type: "color"; color: string }
  | { type: "image"; imageDataUrl: string };

export interface ImageFilters {
  grayscale: boolean;
  brightness: number; // 0-200, default 100
  contrast: number; // 0-200, default 100
  saturation: number; // 0-200, default 100
}

export interface CropRect {
  x: number; // 0-1 percentage from left
  y: number; // 0-1 percentage from top
  w: number; // 0-1 percentage width
  h: number; // 0-1 percentage height
}

export type AppPhase = "idle" | "loading-model" | "processing" | "done" | "error";

export interface AppState {
  phase: AppPhase;
  modelLoaded: boolean;
  modelProgress: number;
  modelProgressText: string;
  errorMessage: string | null;
  originalDataUrl: string | null;
  originalFileName: string;
  maskData: MaskInfo | null;
  resultDataUrl: string | null;
  finalDataUrl: string | null;
  background: BackgroundConfig;
  dominantColor: string | null;
  aspectRatio: string | null; // preset value or null for original
  filters: ImageFilters;
  cropRect: CropRect | null;
  processingStartTime: number | null;
  processingTime: number | null;
}

export type AppAction =
  | { type: "SET_PHASE"; phase: AppPhase }
  | { type: "SET_MODEL_PROGRESS"; progress: number; text: string }
  | { type: "SET_MODEL_LOADED" }
  | { type: "SET_ORIGINAL_IMAGE"; dataUrl: string; fileName: string }
  | { type: "SET_MASK"; mask: MaskInfo }
  | { type: "SET_RESULT"; dataUrl: string }
  | { type: "SET_FINAL"; dataUrl: string }
  | { type: "SET_BACKGROUND"; background: BackgroundConfig }
  | { type: "SET_DOMINANT_COLOR"; color: string }
  | { type: "SET_ASPECT_RATIO"; ratio: string | null }
  | { type: "SET_FILTERS"; filters: Partial<ImageFilters> }
  | { type: "SET_CROP"; crop: CropRect | null }
  | { type: "SET_PROCESSING_START" }
  | { type: "SET_PROCESSING_TIME"; time: number }
  | { type: "SET_ERROR"; message: string }
  | { type: "RESET" };

export interface WorkerInMessage {
  action: "load" | "process";
  imageData?: string;
}

export interface WorkerOutMessage {
  status: "loading" | "model-ready" | "processing" | "result" | "error";
  progress?: number;
  loaded?: number;
  total?: number;
  file?: string;
  message?: string;
  mask?: MaskInfo;
  originalWidth?: number;
  originalHeight?: number;
}
