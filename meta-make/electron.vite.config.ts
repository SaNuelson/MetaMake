import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const isSandbox = process.env.META_MAKE === 'sandbox';
const sandboxOverload = {
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "./src/sandbox/main.ts")
      }
    }
  }
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    ...(isSandbox ? sandboxOverload : {})
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    worker: {
      rollupOptions: {
        treeshake: false
      }
    }
  }
})
