const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.shopify.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Ignore old src directory files that use react-router-dom
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/src\/.*$/,
        contextRegExp: /\.$/,
      })
    )
    return config
  },
  // Exclude src directory from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude src from page detection
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig

