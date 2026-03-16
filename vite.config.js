import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: true, // allow ngrok and other tunnels
  },
  build: {
    target: 'esnext',
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
});
