import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
const env = JSON.stringify(require('dotenv').config().parsed);

console.log({ env });
// https://vitejs.dev/config/
export default defineConfig({
  root: './ui-src',
  define: {
    'process.env': env,
  },
  plugins: [reactRefresh(), viteSingleFile()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: '../dist',
    rollupOptions: {
      // output: {
      //   manualChunks: () => 'everything.js',
      // },
    },
  },
});
