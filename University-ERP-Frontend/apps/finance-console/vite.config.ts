import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shell': path.resolve(import.meta.dirname, './src/shell'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@state': path.resolve(import.meta.dirname, './src/state'),
      '@config': path.resolve(import.meta.dirname, './src/config'),
    },
  },
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: 'http://localhost:5191',
        changeOrigin: true,
      },
    },
  },
});
