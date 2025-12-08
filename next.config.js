/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [],
    unoptimized: true, // Disable image optimization to reduce memory usage
    formats: ['image/avif', 'image/webp'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig
