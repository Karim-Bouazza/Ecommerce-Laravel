import type { NextConfig } from "next";

// Product images are served by the Laravel backend's public disk at
// <NEXT_PUBLIC_API_URL>/storage/... — next/image needs the host allow-listed.
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "https://api.prosecuritydz.tech");

const nextConfig: NextConfig = {
  // Required for the multi-stage Dockerfile, which copies .next/standalone
  // into the production image instead of node_modules + the full source.
  output: "standalone",

  images: {
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
