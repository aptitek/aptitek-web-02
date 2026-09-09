import { defineConfig } from "vitest/config";
import path from "node:path";
const dirname = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "dist/**",
        ".astro/**",
        ".wireit/**",
        ".agents/**",
        "**/*.d.ts",
      ],
    },
  },
});
