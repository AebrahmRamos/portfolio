import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

// Inlined into the bundle at build time. Vite substitutes `undefined` for any
// that are unset and builds happily, which is how the contact form shipped
// dead: fc360d6 removed the deploy workflow that supplied
// VITE_RECAPTCHA_SITE_KEY, local builds had no .env, and the live bundle went
// out as emailjs.send(undefined, undefined, ..., undefined). Fail the build
// instead of shipping a form that can only ever error.
const REQUIRED_BUILD_ENV = [
  'VITE_RECAPTCHA_SITE_KEY',
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
]

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    // loadEnv reads .env files and prefixed process.env, so a CI-provided
    // value satisfies this too.
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const missing = REQUIRED_BUILD_ENV.filter((key) => !env[key])
    if (missing.length > 0) {
      throw new Error(
        `Missing required build-time env: ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill it in; the contact form is broken without these.'
      )
    }
  }

  return {
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
  }
})
