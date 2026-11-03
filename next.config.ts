import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Hostinger shared builds hit process/thread limits with default worker counts.
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        // Prevent LiteSpeed from caching HTML/RSC with stale CSS chunk hashes after deploy.
        source: "/((?!_next/static).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  // Cookie-session dashboards need request-time auth; Cache Components
  // Insights overlays fire on every cookies()/Prisma access without Suspense.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
