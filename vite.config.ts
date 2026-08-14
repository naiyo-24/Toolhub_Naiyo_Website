import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
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
      '/docuforge': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/file-tools': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/auth': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/contact': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/finance-tools': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/internet-tools': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/daily-utility': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/business-tools': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/student-toolkit': { target: 'http://127.0.0.1:8000', changeOrigin: true }
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  }
});
