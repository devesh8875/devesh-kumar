import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
    return [
      {
        source: '/backend/admin',
        destination: `${backendUrl}/backend/admin`,
      },
      {
        source: '/backend/admin/:path+',
        destination: `${backendUrl}/backend/admin/:path+`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/backend/admin',
        permanent: true,
      },
      {
        source: '/admin/:path+',
        destination: '/backend/admin/:path+',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
