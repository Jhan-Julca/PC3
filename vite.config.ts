import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8019',
        changeOrigin: true,
        secure: false,
      },
      '/chancay/api': {
        target: 'http://localhost:8019',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/chancay\/api/, '/api')
      }
    }
  }
});