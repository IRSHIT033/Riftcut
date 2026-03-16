import { AutoModel, AutoProcessor, env, RawImage } from '@huggingface/transformers';

// Browser-only: disable local model loading
env.allowLocalModels = false;

// Singleton instances
let model = null;
let processor = null;
let loading = false;

async function loadModel() {
  if (model && processor) return;
  if (loading) return;
  loading = true;

  try {
    const hasWebGPU = typeof navigator !== 'undefined' && !!navigator.gpu;
    const device = hasWebGPU ? 'webgpu' : 'wasm';
    const dtype = hasWebGPU ? 'fp32' : 'q8';

    postMessage({ status: 'loading', progress: 0, message: `Loading model (${device})...` });

    model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
      device,
      dtype,
      progress_callback: (info) => {
        if (info.status === 'progress') {
          postMessage({
            status: 'loading',
            progress: info.progress,
            loaded: info.loaded,
            total: info.total,
            file: info.file,
          });
        }
      },
    });

    processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
      progress_callback: (info) => {
        if (info.status === 'progress') {
          postMessage({
            status: 'loading',
            progress: info.progress,
            loaded: info.loaded,
            total: info.total,
            file: info.file,
          });
        }
      },
    });

    postMessage({ status: 'model-ready' });
  } catch (err) {
    postMessage({ status: 'error', message: `Failed to load model: ${err.message}` });
  } finally {
    loading = false;
  }
}

async function processImage(imageData) {
  try {
    // Ensure model is loaded
    await loadModel();
    if (!model || !processor) return;

    postMessage({ status: 'processing' });

    // Load and preprocess the image
    const image = await RawImage.fromURL(imageData);
    const { pixel_values } = await processor(image);

    // Run inference
    const { output } = await model({ input: pixel_values });

    // Post-process: resize mask to original image size
    const maskData = await RawImage.fromTensor(output[0].mul(255).to('uint8'))
      .resize(image.width, image.height);

    // Send back the mask dimensions and data
    postMessage({
      status: 'result',
      mask: {
        data: maskData.data,
        width: maskData.width,
        height: maskData.height,
        channels: maskData.channels,
      },
      originalWidth: image.width,
      originalHeight: image.height,
    });
  } catch (err) {
    postMessage({ status: 'error', message: `Processing failed: ${err.message}` });
  }
}

// Listen for messages from main thread
self.onmessage = (e) => {
  const { action, imageData } = e.data;

  switch (action) {
    case 'load':
      loadModel();
      break;
    case 'process':
      processImage(imageData);
      break;
  }
};
