/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/meu-portfolio',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};



export default nextConfig;
