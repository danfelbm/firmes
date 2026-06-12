import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

import AudioDock from "@/components/AudioDock";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://firmes.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Firmes por la Patria — El Tigre como es, completo",
    template: "%s | Firmes por la Patria",
  },
  description:
    "Todo lo que Abelardo de la Espriella ha dicho y hecho: el Milagro sector por sector, 18 años en los medios, sus compromisos con el mundo y su equipo de confianza. Sin recortes. Con orgullo.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Firmes por la Patria",
    description:
      "El portal del Tigre: la palabra de Abelardo de la Espriella, completa y con sus fuentes. Sin recortes. Con orgullo. Colombia 2026.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
        <AudioDock />
        <WhatsAppButton />
      </body>
    </html>
  );
}
