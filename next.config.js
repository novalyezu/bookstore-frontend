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
  async headers() {
    return [
      {
        // matching all API routes
        source: "http://103.31.39.229*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig
