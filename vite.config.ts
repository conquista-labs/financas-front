/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), svgr()],
  base: "/",
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setupTests.ts"],
    mockReset: false,
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: [
        "src/presentation/router",
        "src/presentation/store",
        "src/**/mocks",
        "src/domain",
        "src/types",
        "src/assets",
        "src/config",
        "**/index.ts",
        "**/*.styles.ts",
        "**/*.types.ts",
        "**/*.mock.ts",
        "src/App.tsx",
        "src/main.tsx",
        "src/main.definitions.ts",
        "src/app.definitions.ts",
        "src/vite-env.d.ts",
      ],
    },
  },
  server: {
    port: 3000,
  },
});
