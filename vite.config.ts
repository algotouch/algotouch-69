
import { defineConfig } from "vite";
import fs from 'fs';
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { Plugin } from 'vite';
import { componentTagger } from "lovable-tagger";

function injectSupabaseUrl(): Plugin {
  return {
    name: 'inject-supabase-url',
    apply: 'build',
    closeBundle() {
      const file = path.resolve(__dirname, 'dist/payment-redirect.html');
      if (!fs.existsSync(file)) return;
      const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
      const content = fs.readFileSync(file, 'utf8');
      const replaced = content.replace(/\$\{VITE_SUPABASE_URL\}/g, supabaseUrl);
      fs.writeFileSync(file, replaced);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use relative paths for better compatibility with various hosting environments
  base: "./",
  
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    injectSupabaseUrl(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom")
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    // Force inline critical modules
    assetsInlineLimit: 10000,
    rollupOptions: {
      output: {
        // Use consistent filenames without hashes for better caching and debugging
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        // Define manual chunks to ensure consistent chunk names
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['lucide-react', '@radix-ui/react-toast', '@radix-ui/react-dialog']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Add source maps in development for better debugging
    sourcemap: true,
    // Improve error handling in production
    reportCompressedSize: true,
  }
}));
