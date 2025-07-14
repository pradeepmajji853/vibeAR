import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to handle GLB MIME types
    {
      name: 'configure-glb-mime',
      configureServer(server) {
        server.middlewares.use((req: any, res: any, next: any) => {
          const url = (req as any).url;
          if (url?.endsWith('.glb')) {
            res.setHeader('Content-Type', 'model/gltf-binary');
          } else if (url?.endsWith('.gltf')) {
            res.setHeader('Content-Type', 'model/gltf+json');
          }
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    rollupOptions: {
      output: {
        // Ensure GLB files are treated as assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/glb|gltf/.test(ext ?? '')) {
            return `[name].[ext]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      }
    },
    // Copy GLB files to root of dist
    copyPublicDir: true,
  },
  server: {
    host: true, // Allow external connections
    port: 5174, // Using 5174 as per your current setup
    // Removed HTTPS to avoid SSL certificate issues
  },
});
