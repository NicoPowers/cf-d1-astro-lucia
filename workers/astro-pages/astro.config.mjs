import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    runtime: {
      mode: "local"
    }
  }),
  vite: {
    optimizeDeps: {
      exclude: ["oslo"]
    }
  },
  integrations: [tailwind()]
});