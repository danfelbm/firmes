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
    default: "Firmes por la Patria — La verdad sobre Abelardo de la Espriella",
    template: "%s | Firmes por la Patria",
  },
  description:
    "Veeduría ciudadana sobre el candidato Abelardo de la Espriella: la Contracaja de 31 fichas, 14 años de hemeroteca, el expediente de DDHH y DIH, la voz de las víctimas y el archivo completo de fuentes.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Firmes por la Patria",
    description:
      "Lo que dice Abelardo vs. lo que significa para tu vida. Veeduría ciudadana, elecciones Colombia 2026.",
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
