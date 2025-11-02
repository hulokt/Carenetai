import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer",
    },
    dedupe: ["buffer"],
  },
  define: {
    global: "globalThis",
    "process.env": {},
    "process.version": JSON.stringify(""),
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    include: ["buffer"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      onwarn(warning, warn) {
        // Suppress specific warnings that might not be critical
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        if (warning.message.includes('use client')) return;
        warn(warning);
      },
    },
  },
  // For GitHub Pages with custom domain (carenetai.online):
  // Use base: "/" when using a custom domain
  // If using GitHub Pages without custom domain, use: base: "/Carenetai/"
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
});
