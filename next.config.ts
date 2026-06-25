import type { NextConfig } from "next";

// Static export only in production builds. In dev (the nocms preview),
// `output: "export"` forces every dynamic route to pre-render once and serve
// from RSC cache — that breaks "edit in CMS → reload iframe → see change"
// because the iframe reload would just return the cached HTML.
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
