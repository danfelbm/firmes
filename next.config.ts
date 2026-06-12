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
  async redirects() {
    // Rutas históricas del portal; conservamos los enlaces ya compartidos.
    return [
      {
        source: "/la-contracaja",
        destination: "/el-milagro",
        permanent: true,
      },
      {
        source: "/la-contracaja/:slug",
        destination: "/el-milagro/:slug",
        permanent: true,
      },
      { source: "/hemeroteca", destination: "/prensa", permanent: true },
      {
        source: "/expediente-ddhh",
        destination: "/compromisos",
        permanent: true,
      },
      {
        source: "/la-voz-de-las-victimas",
        destination: "/mensaje-a-las-victimas",
        permanent: true,
      },
      {
        source: "/el-negocio-de-la-salud",
        destination: "/equipo-salud",
        permanent: true,
      },
      {
        source: "/archivo",
        destination: "/centro-de-documentacion",
        permanent: true,
      },
    ];
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
