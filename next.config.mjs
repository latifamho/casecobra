/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "cobra",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["utfs.io"],
  },
};

export default nextConfig;
