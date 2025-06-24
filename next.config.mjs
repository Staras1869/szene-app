/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'blob.v0.dev'],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  swcMinify: true,
}

export default nextConfig
