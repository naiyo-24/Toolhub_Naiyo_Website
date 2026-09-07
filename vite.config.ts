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
      '/docuforge': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/file-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/auth': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/contact': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/finance-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/internet-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/daily-utility': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/business-tools': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } },
      '/student-toolkit': { target: 'https://toolhubbackend.naiyo24.com', changeOrigin: true, bypass: (req) => { if (req.headers.accept?.includes('text/html')) return req.url; } }
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  }
});
