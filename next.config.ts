import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/malaga-investment-dashboard',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/malaga-investment-dashboard',
  },
};

export default nextConfig;
