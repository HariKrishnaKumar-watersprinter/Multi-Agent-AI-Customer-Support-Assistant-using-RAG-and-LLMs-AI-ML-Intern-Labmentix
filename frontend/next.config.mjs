/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

export default nextConfig;
