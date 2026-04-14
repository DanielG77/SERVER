import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Detectar si estamos en Docker usando variable de entorno
// En el Dockerfile, pasaremos DOCKER_ENV=true
const isDocker = process.env.DOCKER_ENV === 'true';
const apiTarget = isDocker ? 'http://tournaments-backend:8080' : 'http://localhost:8080';

console.log(`🔗 API Proxy target: ${apiTarget} (Docker: ${isDocker})`);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
