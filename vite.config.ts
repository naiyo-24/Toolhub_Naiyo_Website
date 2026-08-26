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
      '/docuforge': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/file-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/auth': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/contact': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/finance-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/internet-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/daily-utility': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/business-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true },
      '/student-toolkit': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true }
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  }
});
