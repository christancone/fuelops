/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // needed for Docker deployments
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'caringangels.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.caringangels.xyz',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

export default nextConfig 