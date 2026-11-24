import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal server bundle so the runtime image stays small.
  // The production host only has 1 vCPU / 1 GB RAM, and large images make
  // builds slower than Portainer's timeout allows.
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
