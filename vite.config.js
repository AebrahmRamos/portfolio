import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'aebrahm-ramos-portfolio-bns27.ondigitalocean.app',
      '.ondigitalocean.app', // Allow all DigitalOcean app domains
    ],
  },
})
