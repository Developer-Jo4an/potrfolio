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
    };

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

      {
        source: "/_next/static/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, immutable"
          }
        ]
      },

      {
        source: "/:all*.(png|jpg|jpeg|gif|webp|svg|gltf|mp4|webm|aac|oga|mp3)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, immutable"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
