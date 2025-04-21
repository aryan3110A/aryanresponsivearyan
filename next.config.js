/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co'],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 