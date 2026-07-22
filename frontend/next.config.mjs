/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,   // This disables sharp completely
  },
  reactStrictMode: true,
  // Force serverless for Vercel
  output: 'standalone',
};

export default nextConfig;
