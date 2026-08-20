import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: dir,
  eslint: { ignoreDuringBuilds: true },
  // Middleware owns slash collapsing so /sample-page/ and /1248-2/ 410
  // in one hop, and the 37 301s fire on the trailing-slash WP form.
  skipTrailingSlashRedirect: true,
  images: {
    // Photography lands from Cursor's manifest in a later phase.
    // Do not point production at the legacy WordPress CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
