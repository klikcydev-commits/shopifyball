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
  webpack: (config) => {
    // Ignore old src directory files that use react-router-dom
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/src\/pages\/.*$/,
      })
    )
    return config
  },
}

module.exports = nextConfig

