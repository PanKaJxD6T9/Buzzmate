/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID:459324339,
    NEXT_PUBLIC_ZEGO_SERVER_SECRET:"3255f3d92c5fde28448f517d561381eb"
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;