import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'dist',
  
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

export default nextConfig;
