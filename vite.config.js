import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidStart({ ssr: false }),
    VitePWA({
      registerType: "prompt",
      strategies: "injectManifest",
      srcDir: "/",
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
        icons: [
          {
            src: "/logo192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
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
