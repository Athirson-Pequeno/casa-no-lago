import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/quartos': 'http://localhost:3000',
      '/reservas': 'http://localhost:3000',
      '/clientes': 'http://localhost:3000',
      '/tags': 'http://localhost:3000',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
