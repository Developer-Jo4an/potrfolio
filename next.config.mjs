/** @type {import("next").NextConfig} */
import nextBundleAnalyzer from "@next/bundle-analyzer";

const TYPES = {DEV: "development", PROD: "production"};

const isDev = process.env.NODE_ENV === TYPES.DEV;

const nextConfig = {
  reactStrictMode: false,

  async headers() {
    if (isDev)
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, max-age=0, must-revalidate",
            },
          ],
        },
      ];
    else return [];
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
