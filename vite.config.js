import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
  define: {
    'import.meta.env.BATCH_SERVICE_URL': JSON.stringify(process.env.VITE_BATCH_SERVICE_URL),
    'import.meta.env.PROGRESS_SERVICE_URL': JSON.stringify(process.env.VITE_PROGRESS_SERVICE_URL)
  },
});
