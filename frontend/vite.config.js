import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',  // ensures correct routing in production
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    outDir: 'dist'
  },
  server: {
    // This is only for dev; won't affect production,
    // but good to have for local testing
    historyApiFallback: true
  }
})
