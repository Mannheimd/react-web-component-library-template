/** @type {import('vite').UserConfig} */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";

export default defineConfig(() => ({
  define: {
    "process.env": { NODE_ENV: "production" },
  },
  plugins: [
    react(),
    typescript({
      outDir: "./dist",
    }),
  ],
  build: {
    lib: {
      entry: "./web-components.ts",
      name: "react-web-components",
      formats: ["umd"],
      fileName: (format) => `web-components.${format}.js`,
    },
  },
  esbuild: {
    // Don't change function names to symbols. Allows react devtools to be aware of component names when using the web components in your external page,
    // which makes debugging in your consuming application easier.
    // If the build file becomes too large or you want to be cleaner, consider making a prod-only variant that sets this to false.
    keepNames: true,
  },
}));
