/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/book',
        destination: '/',
        permanent: true,
      },
      {
        source: '/admin/book/update',
        destination: '/admin/book',
        permanent: true,
      },
      {
        source: '/admin/order',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/admin/order/update',
        destination: '/admin',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ]
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
}

module.exports = nextConfig
