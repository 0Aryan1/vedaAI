import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};
export default nextConfig;
