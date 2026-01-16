import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Development server settings
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Add these for better dev experience
      strictPort: false, // If port is busy, try next port
      middlewareMode: false,
    },

    // Production build settings
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: false, // Set to true if you want source maps in prod
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code for better caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'gemini-vendor': ['@google/genai'],
          },
          // Optimize chunk names
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },

    // React plugin with fast refresh
    plugins: [
      react({
        fastRefresh: true,
      }),
    ],

    // Environment variables
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || ''),
                            'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || ''),
                            'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || ''),
                            'process.env.VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV || mode),
                            'process.env.NODE_ENV': JSON.stringify(mode),
    },

    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
                            '@components': path.resolve(__dirname, './src/components'),
                            '@services': path.resolve(__dirname, './src/services'),
                            '@types': path.resolve(__dirname, './src/types'),
                            '@constants': path.resolve(__dirname, './src/constants'),
                            '@hooks': path.resolve(__dirname, './src/hooks'),
      },
      // Handle extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },

    // Optimization
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@google/genai'],
      exclude: ['node_modules'],
    },

    // CSS handling
    css: {
      preprocessorOptions: {
        // If you use SCSS/SASS, add config here
      },
    },

    // Preview server (for `npm run preview`)
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
