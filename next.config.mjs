/** @type {import("next").NextConfig} */

const nextConfig = {
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
