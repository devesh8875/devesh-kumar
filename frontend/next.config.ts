import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend/admin/:path*',
        destination: 'http://localhost:5000/backend/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
