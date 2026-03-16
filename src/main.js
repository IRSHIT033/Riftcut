import './style.css';
import { applyMask, downloadPNG } from './canvas-utils.js';
import { createComparisonSlider } from './comparison-slider.js';

// --- DOM References ---
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const chooseFileBtn = document.getElementById('choose-file-btn');
const progressArea = document.getElementById('progress-area');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const errorArea = document.getElementById('error-area');
const errorText = document.getElementById('error-text');
const errorDismissBtn = document.getElementById('error-dismiss-btn');
const resultArea = document.getElementById('result-area');
const comparisonContainer = document.getElementById('comparison-container');
const downloadBtn = document.getElementById('download-btn');
const newImageBtn = document.getElementById('new-image-btn');

// --- State ---
let currentState = 'idle';
let modelLoaded = false;
let originalDataUrl = null;
let originalFileName = 'background-removed.png';
let resultDataUrl = null;

// --- Mobile detection ---
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const MAX_DIM = isMobile ? 1024 : 2048;

// --- Web Worker ---
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

worker.onmessage = (e) => {
  const msg = e.data;

  switch (msg.status) {
    case 'loading': {
      const progress = msg.progress || 0;
      const loaded = msg.loaded ? (msg.loaded / 1024 / 1024).toFixed(1) : '0';
      const total = msg.total ? (msg.total / 1024 / 1024).toFixed(1) : '?';
      setState('loading-model');
      progressFill.classList.remove('indeterminate');
      progressFill.style.width = progress + '%';
      progressText.textContent = `Downloading AI model... ${loaded} / ${total} MB (${Math.round(progress)}%)`;
      break;
    }

    case 'model-ready':
      modelLoaded = true;
      // If we're waiting with an image, the worker will process it next
      break;

    case 'processing':
      setState('processing');
      break;

    case 'result':
      handleResult(msg);
      break;

    case 'error':
      showError(msg.message);
      break;
  }
};

worker.onerror = (err) => {
  showError('An unexpected error occurred. Please refresh and try again.');
  console.error('Worker error:', err);
};

// --- State Machine ---
function setState(newState) {
  currentState = newState;
  uploadArea.hidden = true;
  progressArea.hidden = true;
  errorArea.hidden = true;
  resultArea.hidden = true;

  switch (newState) {
    case 'idle':
      uploadArea.hidden = false;
      break;
    case 'loading-model':
      progressArea.hidden = false;
      break;
    case 'processing':
      progressArea.hidden = false;
      progressFill.classList.add('indeterminate');
      progressText.textContent = 'Removing background...';
      break;
    case 'done':
      resultArea.hidden = false;
      break;
  }
}

// --- File Handling ---
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showError('Please select a valid image file (JPG, PNG, or WebP).');
    return;
  }

  // Derive output filename
  const baseName = file.name ? file.name.replace(/\.[^.]+$/, '') : 'image';
  originalFileName = baseName + '-bg-removed.png';

  const reader = new FileReader();
  reader.onload = (e) => {
    originalDataUrl = e.target.result;

    // Downscale if very large to avoid memory issues (smaller on mobile)
    downscaleIfNeeded(originalDataUrl, MAX_DIM).then((dataUrl) => {
      originalDataUrl = dataUrl;
      worker.postMessage({ action: 'process', imageData: originalDataUrl });
      setState(modelLoaded ? 'processing' : 'loading-model');
    });
  };
  reader.onerror = () => showError('Failed to read the image file.');
  reader.readAsDataURL(file);
}

async function downscaleIfNeeded(dataUrl, maxDim) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxDim && img.height <= maxDim) {
        resolve(dataUrl);
        return;
      }
      const scale = maxDim / Math.max(img.width, img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

// --- Result Handling ---
async function handleResult(msg) {
  try {
    resultDataUrl = await applyMask(originalDataUrl, msg.mask);
    createComparisonSlider(comparisonContainer, originalDataUrl, resultDataUrl);
    setState('done');
  } catch (err) {
    showError('Failed to process the result. Please try again.');
    console.error('Result handling error:', err);
  }
}

// --- Error Handling ---
function showError(message) {
  errorText.textContent = message;
  uploadArea.hidden = true;
  progressArea.hidden = true;
  resultArea.hidden = true;
  errorArea.hidden = false;
  currentState = 'error';
}

// --- Event Listeners ---

// Choose file button
chooseFileBtn.addEventListener('click', () => fileInput.click());

// File input change
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
  fileInput.value = ''; // Reset so same file can be re-selected
});

// Click on drop zone (but not on the button itself)
uploadArea.addEventListener('click', (e) => {
  if (e.target !== chooseFileBtn) fileInput.click();
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// Paste from clipboard
document.addEventListener('paste', (e) => {
  if (currentState !== 'idle') return;
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) handleFile(file);
      break;
    }
  }
});

// Download button
downloadBtn.addEventListener('click', () => {
  if (resultDataUrl) downloadPNG(resultDataUrl, originalFileName);
});

// New image button
newImageBtn.addEventListener('click', () => {
  originalDataUrl = null;
  resultDataUrl = null;
  comparisonContainer.innerHTML = ''; // free image memory
  setState('idle');
});

// Error dismiss
errorDismissBtn.addEventListener('click', () => {
  setState('idle');
});

// --- Initialize ---
setState('idle');
