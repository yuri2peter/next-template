/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_TYPE === 'standalone' ? 'standalone' : undefined,
  serverExternalPackages: ['json-server'],
};

export default nextConfig;
