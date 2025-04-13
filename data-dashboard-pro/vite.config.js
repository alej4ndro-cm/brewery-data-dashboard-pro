import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/brewery-data-dashboard-pro/', // Corrected for GitHub Pages deployment
  plugins: [react()]
})
