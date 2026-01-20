/** @type {import("next").NextConfig} */

const nextConfig = {
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
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate"
          }
        ]
      },
    ]
  }
};

export default nextConfig;
