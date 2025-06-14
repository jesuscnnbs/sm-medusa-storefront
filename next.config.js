const checkEnvVariables = require("./check-env-variables");
const createNextIntlPlugin = require("next-intl/plugin");

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
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
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
      protocol: "https",
      hostname: "vsjuinswujbvevyklzxg.supabase.co",
    },
    ],
  },
}

const withNextIntl = createNextIntlPlugin();
module.exports = withNextIntl(nextConfig);
