/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(txt|md)$/, // Adjust the file extension as needed
      use: 'raw-loader',
    });

    return config;
  },
};

export default nextConfig;
