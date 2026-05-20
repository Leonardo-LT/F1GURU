import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidStart({ ssr: false }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "F1 GURU",
        short_name: "F1GURU",
        description: "F1 in your hands",
        theme_color: "#1f2937",
        background_color: "#1f2937",
        display: "standalone",
        start_url: "/",
        scope: "/",
      },
    }),
  ],
  optimizeDeps: {
    include: [],
  },
  build: {
    target: "esnext",
  },
  server: {
    port: 3000,
  },
});
