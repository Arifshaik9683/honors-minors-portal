import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/student/dashboard',
        destination: '/student/enroll',
      },
    ];
  },
};

export default nextConfig;
