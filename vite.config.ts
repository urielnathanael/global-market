import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "172.21.208.1",
    port: 8083,
  },
  optimizeDeps: {
    force: true, // Force dependency re-optimization
  },
  plugins: [react()],
  build: {
    minify: true,
    sourcemap: false,
  },
  define: {
    __DEV__: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
