import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Cloudflare is served at the domain root; GitHub Pages builds set this to
  // /visual-portfolio/ so all generated asset links remain inside the project.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
