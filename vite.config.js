import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2018',
    minify: 'terser',
    cssMinify: 'lightningcss',
    cssCodeSplit: false,
    sourcemap: false,
    assetsInlineLimit: 4096,
    modulePreload: { polyfill: false },
    reportCompressedSize: true,
    terserOptions: {
      compress: { drop_console: true, passes: 2 },
      mangle: true,
    },
  },
  css: {
    lightningcss: {
      targets: {
        chrome: 90 << 16,
        firefox: 90 << 16,
        safari: (14 << 16) | (1 << 8),
      },
    },
  },
});
