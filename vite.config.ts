import { defineConfig, Plugin, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  define: {
    // expose the non-VITE_ prefixed variables to the VITE_ prefixed ones
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.BACKEND_BASE_URL),
    'import.meta.env.VITE_N8N_WEBHOOK_URL': JSON.stringify(process.env.N8N_WEBHOOK_URL),
    'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(process.env.FRONTEND_URL),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use('/api', app);
      
      // Handle client-side routing - serve index.html for non-API routes
      server.middlewares.use('*', (req, res, next) => {
        if (req.originalUrl?.startsWith('/api')) {
          return next();
        }
        // Let Vite handle serving the index.html for client-side routing
        next();
      });
    },
  };
}
