/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: []
  },
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    };

    return config;
  }
};

export default nextConfig;
