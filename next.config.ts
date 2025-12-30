/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);



/* import type { NextConfig } from "next";

/** @type {import('next').NextConfig} *//*
const withPWA = require('next-pwa')({
  dest: 'dist',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  /* config options here *//*
  output: 'export',
  distDir: 'dist',
  
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

module.exports = withPWA(nextConfig) */
