import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Disable the Cloudflare plugin so the SSR bundle is plain Node-compatible
// (Vercel serverless function reads dist/server/index.js).
export default defineConfig({
  cloudflare: false,
});
