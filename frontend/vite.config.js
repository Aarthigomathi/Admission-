import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const plugins = [react(), tailwindcss()]

// Keep the Arena live preview on the Karpagam page without changing the site's production home route.
if (process.env.KCE_PREVIEW_KARPAGAM === '1') {
  plugins.push({
    name: 'karpagam-preview-home-route',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] === '/') {
          response.writeHead(302, { Location: '/college/karpagam-college-of-engineering' })
          response.end()
          return
        }
        next()
      })
    },
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    }
  }
})
