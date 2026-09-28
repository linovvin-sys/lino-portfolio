import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
    ],
  },
  transpilePackages: ["three"],
  webpack: (config) => {
    config.module?.rules?.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
