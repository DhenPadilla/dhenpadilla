import createMDX from "@next/mdx";

// Derive the R2 host from the public base URL when present. This only affects
// next/image (which we don't use on the now page — media is plain <img>/<video>);
// it's here purely as a guardrail for any future next/image usage.
const publicBase = process.env.R2_PUBLIC_BASE_URL;
const remotePatterns = publicBase
  ? [{ protocol: "https", hostname: new URL(publicBase).hostname }]
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    unoptimized: true, // Netlify, not Vercel — no next/image optimization
    remotePatterns,
  },
};

export default createMDX({})(nextConfig);
