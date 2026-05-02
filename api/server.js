// Vercel serverless function that proxies all requests to the TanStack Start
// SSR bundle. The default export of dist/server/index.js is a Worker-style
// `{ fetch }` object created by createServerEntry().
import server from "../dist/server/index.js";
import { Readable } from "node:stream";

export const config = {
  // Use Node.js runtime (not Edge) — TanStack Start's default SSR bundle
  // targets Node when the Cloudflare plugin is disabled.
  runtime: "nodejs",
};

function buildRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, String(value));
    }
  }

  const init = { method: req.method, headers };
  if (req.method && !["GET", "HEAD"].includes(req.method.toUpperCase())) {
    // Convert Node IncomingMessage stream into a Web ReadableStream
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }

  return new Request(url.toString(), init);
}

export default async function handler(req, res) {
  try {
    const request = buildRequest(req);
    const response = await server.fetch(request);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (e) {
    console.error("[ssr] handler failed:", e);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end(`SSR error: ${e?.message || String(e)}`);
  }
}
