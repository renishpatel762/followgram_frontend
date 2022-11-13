/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites(){
    return[
      {
        source:'/api/:path*',
        destination:'http://localhost:5000/:path*' //proxy to backend
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['res.cloudinary.com']
  },
}

module.exports = nextConfig
