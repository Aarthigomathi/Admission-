import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

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

// The browser calls relative /api URLs; Vite forwards them to Spring Boot in dev/preview.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = (env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8080').replace(/\/+$/, '')
  const apiProxy = {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      secure: false
    }
  }

  return {
    plugins,
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: true,
      proxy: apiProxy,
      headers: { 'X-Frame-Options': 'ALLOWALL' }
    },
    preview: {
      host: '0.0.0.0',
      proxy: apiProxy,
      headers: { 'X-Frame-Options': 'ALLOWALL' }
    }
  }
})
