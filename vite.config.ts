import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'offline.html'],
      manifest: {
        name: 'Kone Consult',
        short_name: 'KoneConsult',
        description: 'World-class digital experiences and scalable infrastructure.',
        theme_color: '#0d1117',
        background_color: '#0d1117',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/]
      }
    })
  ],
  server: {
    port: 3001,
  },
  build: {
    target: 'es2015',
    outDir: 'build',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core  — rarely changes, long-lived cache
          'vendor-react': ['react', 'react-dom'],
          // Routing
          'vendor-router': ['react-router-dom'],
          // Firebase SDK — large but stable
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Charts — only needed on admin/analytics views
          'vendor-recharts': ['recharts'],
          // Animation — only needed on pages that use it
          'vendor-framer': ['framer-motion'],
          // Syntax highlighting — only needed on docs
          'vendor-prism': ['prismjs'],
        }
      }
    }
  }
});

// Trigger dev server restart to reload missing .env files
