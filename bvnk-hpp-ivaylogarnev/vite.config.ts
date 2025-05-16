/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import type { UserConfig } from 'vite';

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
      '@guards': '/src/guards',
      '@lib': '/src/lib',
      '@hooks': '/src/hooks',
      '@styles': '/src/styles',
      '@services': '/src/services',
      '@utils': '/src/utils'
    }
  },
  server: {
    port: 3000
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'build/**'],
    coverage: {
      provider: 'v8',
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'jest.setup.ts',
        'tailwind.config.js',
        '**/*.config.{js,ts}',
        '**/*.setup.{js,ts}',
        'src/models/**',
        // Excluding the component library components
        'src/components/ui/**',
        'src/hooks/useToast.ts',
        'vite-env.d.ts',
        '**/*.d.ts',
        '**/__tests__/**'
      ]
    },
    deps: {
      optimizer: {
        web: {
          include: ['@testing-library/user-event']
        }
      }
    }
  }
} as UserConfig);
