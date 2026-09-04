import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@university-erp/ui-kit': path.resolve(__dirname, './libs/ui-kit/src'),
      '@university-erp/core-logger': path.resolve(__dirname, './libs/core-logger'),
      '@university-erp/api-clients': path.resolve(__dirname, './libs/api-clients'),
      '@university-erp/auth-sdk': path.resolve(__dirname, './libs/auth-sdk'),
      '@university-erp/domain-viewmodels': path.resolve(__dirname, './libs/domain-viewmodels'),
      '@university-erp/shell-kit': path.resolve(__dirname, './libs/shell-kit'),
      '@university-erp/workflow-sdk': path.resolve(__dirname, './libs/workflow-sdk'),
    },
  },
});
