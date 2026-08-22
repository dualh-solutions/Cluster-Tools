import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/tools/compress-image', destination: '/tools/image/image-compressor', permanent: true },
      { source: '/tools/crop-image', destination: '/tools/image/image-cropper', permanent: true },
      { source: '/tools/jpg-to-pdf', destination: '/tools/pdf/jpg-to-pdf', permanent: true },
      { source: '/tools/jpg-to-png', destination: '/tools/image/jpg-to-png', permanent: true },
      { source: '/tools/pdf-to-jpg', destination: '/tools/pdf/pdf-to-jpg', permanent: true },
      { source: '/tools/png-to-jpg', destination: '/tools/image/png-to-jpg', permanent: true },
      { source: '/tools/resize-image', destination: '/tools/image/image-resizer', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
