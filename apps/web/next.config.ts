import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@baara/shared-types'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
