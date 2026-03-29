import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
