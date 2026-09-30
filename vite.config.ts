import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Wish/",
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,        // <-- Static prerender ON karo
        crawlLinks: true,     // <-- Saare links crawl karke prerender karo
        autoSubfolderIndex: true,
      },
    }),
    viteReact(),
  ],
});
