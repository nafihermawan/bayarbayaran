import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.png', 'icon.svg'],
      manifest: {
        name: 'BayarBayaran',
        short_name: 'BayarBayaran',
        description: 'Aplikasi split bill',
        theme_color: '#ffffff',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '/',
        icons: [
  {
    src: '/icon1.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: '/icon2.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any maskable'
  }
]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});