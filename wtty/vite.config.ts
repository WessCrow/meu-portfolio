import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Base fixo na raiz: desenvolvimento e build batem com o mesmo URL (local / preview).
// Se um dia publicar o wtty num subcaminho de Pages, use env, ex.: base: process.env.VITE_BASE ?? '/'
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5173,
    strictPort: false,
  },
})
