import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: { sourcemap: true },
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
})
