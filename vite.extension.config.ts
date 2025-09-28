import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Vite config for Chrome extension side panel
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'extension/sidepanel',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.extension.html')
      }
    },
    copyPublicDir: false
  },
  define: {
    // Define extension context for the app
    'process.env.EXTENSION_CONTEXT': JSON.stringify('chrome-extension')
  }
})
