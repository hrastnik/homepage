// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    isr: false,
    edgeMiddleware: false,
    webAnalytics: { enabled: false },
    maxDuration: 15,
    // @ts-ignore - this is maybe a valid option
    functionPerRoute: false,
  }),
  integrations: [tailwind()],
});
