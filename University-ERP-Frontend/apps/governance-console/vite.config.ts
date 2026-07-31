import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shell': path.resolve(__dirname, './src/shell'),
      '@features': path.resolve(__dirname, './src/features'),
      '@state': path.resolve(__dirname, './src/state'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 5177,
    proxy: {
      '/api': {
        target: 'http://localhost:5191',
        changeOrigin: true,
      },
    },
  },
});
