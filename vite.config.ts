/// <reference types='vitest/config' />
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
// @ts-expect-error import resolution
import brotli from 'rollup-plugin-brotli'
// import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

import pkg from './package.json'
// const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const alias = [
  {
    find: '@/',
    replacement: 'src/',
  },
]

const exclude = [
  './**.config.*',
  './**.shims.*',
  './\\.storybook/**.ts',
  './src/*.{ts,tsx}',
  './src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
]

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
          test: /\.(js|css|html|txt|xml|json|svg|ico|ttf|otf|eot)$/,
          // file extensions to compress (default is shown)
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
      clean: true,
      enabled: true,
      exclude: [...configDefaults.exclude, ...exclude],
      provider: 'v8',
      reporter: ['html'],
      thresholds: {
        branches: 97,
        functions: 98,
        lines: 98,
        statements: 98,
      },
    },
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, ...exclude],
    globals: true,
    include: [
      'src/components/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'src/network/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'src/pages/**/*.{test,spec}.?(c|m)[jt]s?(x)',
    ],
    setupFiles: './vitest.setup.ts',
    // projects: [
    //   {
    //     extends: true,
    //     plugins: [
    //       // The plugin will run tests for the stories defined in your Storybook config
    //       // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    //       storybookTest({
    //         configDir: path.join(dirname, '.storybook'),
    //       }),
    //     ],
    //     test: {
    //       name: 'storybook',
    //       browser: {
    //         enabled: true,
    //         headless: true,
    //         provider: 'playwright',
    //         instances: [
    //           {
    //             browser: 'chromium',
    //           },
    //         ],
    //       },
    //       exclude,
    //       setupFiles: ['.storybook/vitest.setup.ts'],
    //     },
    //   },
    // ],
  },
})
