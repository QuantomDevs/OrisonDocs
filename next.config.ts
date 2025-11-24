// Register tsconfig paths for runtime resolution
require('./register-paths');

import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'quantomdocs-mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'quantomdocs-core',
    'quantomdocs-ui',
    'quantomdocs-mdx',
    'quantomdocs-openapi',
  ],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { isServer }) => {
    // Add namespace aliases for internal package imports
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@core': require('path').resolve(__dirname, 'src/quantomdocs-core'),
      '@ui': require('path').resolve(__dirname, 'src/quantomdocs-ui'),
      '@mdx': require('path').resolve(__dirname, 'src/quantomdocs-mdx'),
      '@openapi': require('path').resolve(__dirname, 'src/quantomdocs-openapi'),
    };
    return config;
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/docs/ui/blocks/layout',
        destination: '/docs/ui/layouts/docs',
        permanent: true,
      },
      {
        source: '/docs/ui/blocks/:path*',
        destination: '/docs/ui/layouts/:path*',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
