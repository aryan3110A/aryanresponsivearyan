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
        port: '7862',
        pathname: '/download/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',  
        port: '7862',
        pathname: '/outputs/**',
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
        hostname: '*.oss-cn-wulanchabu.aliyuncs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.oss-us-east-1.aliyuncs.com',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: '3770353c90dd.ngrok-free.app',
        pathname: '/**',
      },
        {
         protocol: 'https',
         hostname: 'a52873fa8a11.ngrok-free.app',
         pathname: '/**',
       },
       {
        protocol: 'https',
        hostname: 'f3f35ea9db7b.ngrok-free.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'delivery-us1.bfl.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'delivery-eu1.bfl.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'delivery-eu4.bfl.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'delivery-*.bfl.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.wildmindai.com',
        pathname: '/core/**',  // or '/**' if you serve assets elsewhere
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