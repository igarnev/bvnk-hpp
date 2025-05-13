import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@features': '/src/features',
      '@models': '/src/models',
      '@pages': '/src/pages',
      '@lib': '/src/lib',
      '@styles': '/src/styles',
      '@services': '/src/services',
      '@utils': '/src/utils'
    }
  },
  server: {
    port: 3000
  }
});
