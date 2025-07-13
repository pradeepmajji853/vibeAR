import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  publicDir: 'assets',
  server: {
    host: true, // Allow external connections
    port: 5173,
  },
});
