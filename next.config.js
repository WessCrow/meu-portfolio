/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  basePath: isProd ? '/meu-portfolio' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      { source: '/wtype', destination: '/wtype/index.html' },
      { source: '/wtype/', destination: '/wtype/index.html' },
    ];
  },
};





export default nextConfig;
