/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true }
};

module.exports = {
  webpack: (config) => {
    config.resolve.preferRelative = true;
    return config;
  },
};;
