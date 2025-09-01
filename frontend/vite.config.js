import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',  // keeps service worker updated
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'PureDrop Owner',
        short_name: 'PureDrop Owner',
        start_url: '/',
        display: 'standalone',
        theme_color: '#212529',
        background_color: '#333326',
        icons: [
          {
            src: '/icons/icon-192.jpg',
            sizes: '192x192',
            type: 'image/jpg'
          },
          {
            src: '/icons/icon-512.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          }
        ]
      }
    })
  ]
})
