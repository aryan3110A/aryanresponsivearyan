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
        hostname: 'delivery-us1.bfl.ai',
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