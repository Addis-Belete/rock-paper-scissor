import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
} satisfies NextConfig | Record<string, any>;

export default nextConfig;
