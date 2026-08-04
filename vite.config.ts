import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Disable the Nitro deploy plugin. On Vercel, Nitro auto-detects the platform
  // and emits a Build Output API directory (.vercel/output), which overrides the
  // `outputDirectory` in vercel.json and drops the client asset bundle (CSS/JS).
  // With Nitro off, Vite emits plain dist/client + dist/server, which vercel.json
  // and api/server.js serve directly.
  nitro: false,
});
