/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {

    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images: {
    unoptimized: true, // Disable image optimization
  },
};

module.exports = nextConfig;
