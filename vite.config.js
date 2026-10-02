import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    },
    // Spring Boot backend - when it runs on :8080 (mvn spring-boot:run),
    // /api/* requests are proxied to it and the frontend uses live data.
    // When the backend is offline, the frontend falls back to the cloned
    // seed data (src/lib/backendData.js).
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
