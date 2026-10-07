import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2018",
    cssTarget: ["chrome90", "firefox90", "safari14.1"],
    modulePreload: { polyfill: false },
  },
});
