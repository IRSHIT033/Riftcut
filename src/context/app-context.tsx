"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { AppState, AppAction } from "@/lib/types";

const initialState: AppState = {
  phase: "idle",
  modelLoaded: false,
  modelProgress: 0,
  modelProgressText: "Preparing AI model...",
  errorMessage: null,
  originalDataUrl: null,
  originalFileName: "background-removed.png",
  maskData: null,
  resultDataUrl: null,
  finalDataUrl: null,
  background: { type: "transparent" },
  dominantColor: null,
  aspectRatio: null,
  processingStartTime: null,
  processingTime: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "SET_MODEL_PROGRESS":
      return {
        ...state,
        modelProgress: action.progress,
        modelProgressText: action.text,
      };
    case "SET_MODEL_LOADED":
      return { ...state, modelLoaded: true };
    case "SET_ORIGINAL_IMAGE":
      return {
        ...state,
        originalDataUrl: action.dataUrl,
        originalFileName: action.fileName,
      };
    case "SET_MASK":
      return { ...state, maskData: action.mask };
    case "SET_RESULT":
      return { ...state, resultDataUrl: action.dataUrl, finalDataUrl: action.dataUrl };
    case "SET_FINAL":
      return { ...state, finalDataUrl: action.dataUrl };
    case "SET_BACKGROUND":
      return { ...state, background: action.background };
    case "SET_DOMINANT_COLOR":
      return { ...state, dominantColor: action.color };
    case "SET_ASPECT_RATIO":
      return { ...state, aspectRatio: action.ratio };
    case "SET_PROCESSING_START":
      return { ...state, processingStartTime: Date.now(), processingTime: null };
    case "SET_PROCESSING_TIME":
      return { ...state, processingTime: action.time };
    case "SET_ERROR":
      return { ...state, phase: "error", errorMessage: action.message };
    case "RESET":
      return {
        ...initialState,
        modelLoaded: state.modelLoaded,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
