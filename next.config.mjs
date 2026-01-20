/** @type {import("next").NextConfig} */

const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  images: {
    remotePatterns: []
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true
    }

    return config;
  }
};

export default nextConfig;
