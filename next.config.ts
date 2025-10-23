import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 호스트 허용
      },
      {
        protocol: 'http',
        hostname: '**', // 모든 HTTP 호스트 허용 (개발용)
      },
    ],
  },
};

export default nextConfig;
