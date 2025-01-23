/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {

    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images: {
    domains: ['fakestoreapi.com', 'cdn.dummyjson.com', 'images.unsplash.com', 'source.unsplash.com', 'api.unsplash.com', 'plus.unsplash.com', 'logo.clearbit.com'], // Add the domain here
  },
};

module.exports = nextConfig;
