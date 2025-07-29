/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7861',
        pathname: '/download/**',
      },
      {
        protocol: 'https',
        hostname: 'api.wildmindai.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.minimax.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.minimax.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public-cdn-video-data-algeng-us.oss-us-east-1.aliyuncs.com',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'c9b20607338c.ngrok-free.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '9fbe9881d16c.ngrok-free.app',
        pathname: '/**',
      },
    ],
    // Exclude video files from image optimization
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  // Add static file serving configuration
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/static/:path*',
      },
    ]
  },
};

module.exports = nextConfig; 