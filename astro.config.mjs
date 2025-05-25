// @ts-check
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  srcDir: ".",
  integrations: [react(), partytown()],
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
