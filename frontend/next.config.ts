import type { NextConfig } from "next";

// Product images are served by the Laravel backend's public disk at
// <NEXT_PUBLIC_API_URL>/storage/... — next/image needs the host allow-listed.
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "https://api.prosecuritydz.tech");

const nextConfig: NextConfig = {
  // Required for the multi-stage Dockerfile, which copies .next/standalone
  // into the production image instead of node_modules + the full source.
  output: "standalone",

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [384, 640, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        pathname: "/storage/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
