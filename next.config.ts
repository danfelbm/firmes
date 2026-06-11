import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Solo permitimos assets del Storage público de nuestro proyecto Supabase.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rfypuobqaaxajjkhnqxx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
