import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/admin': {
        target: 'https://back-oki.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
