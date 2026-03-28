import {
  AutoModel,
  AutoProcessor,
  env,
  RawImage,
} from "@huggingface/transformers";

env.allowLocalModels = false;

let model: Awaited<ReturnType<typeof AutoModel.from_pretrained>> | null = null;
let processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>> | null = null;
let loading = false;

async function loadModel() {
  if (model && processor) return;
  if (loading) return;
  loading = true;

  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const hasWebGPU = typeof navigator !== "undefined" && !!(navigator as unknown as Record<string, unknown>).gpu;
    const device = !isMobile && hasWebGPU ? "webgpu" : "wasm";
    const dtype = !isMobile && hasWebGPU ? "fp32" : "q8";

    postMessage({
      status: "loading",
      progress: 0,
      message: `Loading model (${device})...`,
    });

    model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
      device: device as "webgpu" | "wasm",
      dtype: dtype as "fp32" | "q8",
      progress_callback: (info: Record<string, unknown>) => {
        if (info.status === "progress") {
          postMessage({
            status: "loading",
            progress: info.progress,
            loaded: info.loaded,
            total: info.total,
            file: info.file,
          });
        }
      },
    });

    processor = await AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
      progress_callback: (info: Record<string, unknown>) => {
        if (info.status === "progress") {
          postMessage({
            status: "loading",
            progress: info.progress,
            loaded: info.loaded,
            total: info.total,
            file: info.file,
          });
        }
      },
    });

    postMessage({ status: "model-ready" });
  } catch (err) {
    postMessage({
      status: "error",
      message: `Failed to load model: ${(err as Error).message}`,
    });
  } finally {
    loading = false;
  }
}

async function processImage(imageData: string) {
  try {
    await loadModel();
    if (!model || !processor) return;

    postMessage({ status: "processing" });

    const image = await RawImage.fromURL(imageData);
    const { pixel_values } = await processor(image);
    const { output } = await model({ input: pixel_values });

    const rawMask = output[0].mul(255).to("uint8");
    const maskData = await RawImage.fromTensor(rawMask).resize(
      image.width,
      image.height
    );

    postMessage({
      status: "result",
      mask: {
        data: maskData.data,
        width: maskData.width,
        height: maskData.height,
        channels: maskData.channels,
      },
      originalWidth: image.width,
      originalHeight: image.height,
    });

    pixel_values.dispose?.();
    output[0].dispose?.();
    rawMask.dispose?.();
  } catch (err) {
    postMessage({
      status: "error",
      message: `Processing failed: ${(err as Error).message}`,
    });
  }
}

self.onmessage = (e: MessageEvent) => {
  const { action, imageData } = e.data;
  switch (action) {
    case "load":
      loadModel();
      break;
    case "process":
      processImage(imageData);
      break;
  }
};
