import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    cors:true,
    // port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:2000',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://127.0.0.1:2000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    allowedHosts: ["*"]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});
