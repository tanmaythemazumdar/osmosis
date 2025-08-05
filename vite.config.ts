/// <reference types='vitest/config' />
import zlib from 'node:zlib'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// @ts-expect-error import resolution
import brotli from 'rollup-plugin-brotli'

import pkg from './package.json'

const alias = [{ find: '@/', replacement: 'src/' }]

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 180,
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.endsWith('react')) {
            return 'react'
          } else if (id.includes('react-dom')) {
            return 'react-dom'
          } else if (/-?react-?/g.test(id)) {
            return 'react-vendor'
          }
        },
      },
      plugins: [
        brotli({
          test: /\.(js|css|html|txt|xml|json|svg|ico|ttf|otf|eot)$/, // file extensions to compress (default is shown)
          options: {
            params: {
              [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC,
              [zlib.constants.BROTLI_PARAM_QUALITY]: 7, // turn down the quality, resulting in a faster compression (default is 11)
            },
            // ... see all options https://nodejs.org/api/zlib.html#zlib_class_brotlioptions
          },
          additional: [
            //  Manually list more files to compress alongside.
            // 'dist/bundle.css'
          ],
          // Ignore files smaller than this
          // minSize: 1000
        }),
      ],
    },
  },
  define: {
    __NAME__: JSON.stringify(pkg.name),
    __VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react()],
  resolve: {
    alias,
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
  },
  test: {
    alias,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['html'],
      thresholds: {
        branches: 98,
        functions: 98,
        lines: 98,
        statements: 98,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: './vitest.setup.ts',
  },
})
