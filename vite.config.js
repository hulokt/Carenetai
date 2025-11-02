import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer",
      "#minpath": path.resolve(__dirname, "node_modules/vfile/lib/minpath.browser.js")
    },
    dedupe: ["buffer"],
    conditions: ["browser", "module", "import", "default"]
  },
  define: {
    global: "globalThis",
    "process.env": {},
    "process.version": JSON.stringify("")
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    },
    include: ["buffer"]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        if (warning.message.includes("use client")) return;
        warn(warning);
      }
    }
  },
  base: process.env.NODE_ENV === "production" ? "/" : "/"
});
