/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths({
      loose: true,
    }),
  ],
  test: {
    globals: true,
    root: "./",
    include: ["src/modules/**/services/**/*.spec.ts"],
    coverage: {
      include: ["src/modules/**/services/**"],
    },
  },
});
