import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: dir,
  eslint: { ignoreDuringBuilds: true },
  // PLAN §1 row 3: preserve /commercial|residential/<slug>/ *exactly*, trailing slash and
  // all. WordPress served the slashed form for four years, so that is the canonical URL and
  // the unslashed form 308s onto it. Middleware still owns the 410s and the 301 table, which
  // normalise the slash before matching, so both forms resolve either way.
  trailingSlash: true,
  images: {
    // Photography is served from the git-ignored dump through the public/photos symlink
    // (scripts/link-photos.mjs). No remote host: production will point at Sanity, never at
    // the legacy WordPress CDN.
    remotePatterns: [],
    // The originals are up to 5600x3733 and one is 12 MB, so serve a modern format.
    // WebP only, deliberately: AVIF encodes fine here but decoded to a wrong-size, blank
    // frame in the review browser, and a client picking a design direction must not be the
    // one to discover that. WebP is universally supported and still cuts a full-bleed
    // retina hero to a fraction of the JPEG.
    formats: ["image/webp"],
    // 332px index tiles, ~400px content column, and full-bleed heroes up to 4K retina.
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2560, 3840],
    imageSizes: [166, 332, 400, 664],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
