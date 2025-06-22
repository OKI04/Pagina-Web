import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5174,
    proxy: {
      '/admin': {
        target: 'https://back-oki.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
