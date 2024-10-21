import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { ApiURL, devApiUrl } from "./src/setting/config.js";

import { isDev } from "../config.js";

import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./src/locales/**"
      ),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8081,
    https: false,
    proxy: {
      "/api": {
        target: isDev ? devApiUrl : ApiURL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
