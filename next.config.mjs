/** @type {import("next").NextConfig} */
import nextBundleAnalyzer from "@next/bundle-analyzer";

const TYPES = {DEV: "development", PROD: "production"};

const isDev = process.env.NODE_ENV === TYPES.DEV;

const nextConfig = {
  reactStrictMode: false,

  headers() {
    if (!isDev) return [];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [],
    qualities: [1, 25, 50, 75, 100],
  },

  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    if (isDev) config.cache = false;

    return config;
  },
};

const withBundleAnalyzer = nextBundleAnalyzer({enabled: process.env.ANALYZE === "true"});

export default withBundleAnalyzer(nextConfig);
