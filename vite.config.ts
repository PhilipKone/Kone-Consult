import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  build: {
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
