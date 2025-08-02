import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental : {
cacheComponents: true,
    authInterrupts: true
  }
};

export default nextConfig;
