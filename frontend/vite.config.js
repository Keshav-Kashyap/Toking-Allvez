import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // make sure this is present
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    outDir: 'dist'
  }
})
