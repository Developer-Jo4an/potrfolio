/** @type {import("next").NextConfig} */
import nextBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  output: "export",
  reactStrictMode: false,
  images: {
    remotePatterns: [],
    unoptimized: true,
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
