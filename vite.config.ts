import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' membuat build bisa jalan di GitHub Pages (subfolder repo) tanpa konfigurasi tambahan
export default defineConfig({ base: './', plugins: [react()] })
