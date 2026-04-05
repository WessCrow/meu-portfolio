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
  env: {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_8wp619u',
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: 'template_7sdzcnw',
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: 'cC411rcwYzHJKylQn',
  },
};




export default nextConfig;
