/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
