import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      protocol: 'wss'
    },
    proxy: {
      '/docuforge': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/file-tools': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/auth': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/contact': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/finance-tools': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/internet-tools': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/daily-utility': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/business-tools': { target: 'https://backend.toolhubutility.com', changeOrigin: true },
      '/student-toolkit': { target: 'https://backend.toolhubutility.com', changeOrigin: true }
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  }
});
