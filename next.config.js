/** @type {import("next").NextConfig} */
const path = require("path");
const nextBundleAnalyzer = require("@next/bundle-analyzer");

const TYPES = {DEV: "development", PROD: "production"};

const isDev = process.env.NODE_ENV === TYPES.DEV;

console.log("isDev >>", isDev)

const nextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["localhost", "192.168.1.64"],

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

    return config;
  },

  outputFileTracingRoot: path.join(__dirname, "/*"),
};

module.exports = nextBundleAnalyzer({enabled: process.env.ANALYZE === "true"})(nextConfig)
