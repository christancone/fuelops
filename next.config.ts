import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone', // needed for Docker deployments
  reactStrictMode: true,
  images: {
    domains: ['caringangels.xyz', 'www.caringangels.xyz'], // if you plan to serve external images
  },
}

export default nextConfig
