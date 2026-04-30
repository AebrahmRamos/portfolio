import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'aebrahmramos.dev',
      'www.aebrahmramos.dev',
    ],
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'aebrahm-ramos-portfolio-bns27.ondigitalocean.app',
      '.ondigitalocean.app',
      'aebrahmramos.dev',
      'www.aebrahmramos.dev',
    ],
  },
})
