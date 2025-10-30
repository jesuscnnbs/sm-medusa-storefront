const checkEnvVariables = require("./check-env-variables");
const createNextIntlPlugin = require("next-intl/plugin");

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
module.exports = withNextIntl(nextConfig);
