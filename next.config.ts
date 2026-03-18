import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2lq7oo3auy5hy.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
