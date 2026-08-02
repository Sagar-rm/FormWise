import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'firebase/app': path.resolve(__dirname, './src/lib/mock-firebase.js'),
      'firebase/auth': path.resolve(__dirname, './src/lib/mock-firebase.js'),
      'firebase/firestore': path.resolve(__dirname, './src/lib/mock-firebase.js'),
      'firebase/storage': path.resolve(__dirname, './src/lib/mock-firebase.js'),
      'firebase/analytics': path.resolve(__dirname, './src/lib/mock-firebase.js'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})

