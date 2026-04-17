import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing", "postprocessing"],
  // Turbopack is the default in Next.js 16. Empty config silences the warning.
  turbopack: {},
};

export default nextConfig;
