import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  /** need to set the base, otherwise the breakpoint would not bind in vscode */
  base: "./",
  build: {
    outDir: "build/webapp",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react({
      /** needed to support typescript decorations */
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy", "classProperties"],
        },
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
