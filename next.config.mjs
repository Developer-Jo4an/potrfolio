/** @type {import("next").NextConfig} */
import nextBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [],
    qualities: [25, 50, 75, 100],
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
};

const withBundleAnalyzer = nextBundleAnalyzer({enabled: process.env.ANALYZE === "true"});

export default withBundleAnalyzer(nextConfig);
