// Constantes globales del sitio "Firmes por la Patria".

export const SITE_NAME = "Firmes por la Patria";

/**
 * URL pública del audio "CALLE" (Supabase Storage, bucket `media`).
 * Si queda vacía, el AudioDock no se renderiza.
 */
export const AUDIO_CALLE_URL =
  "https://rfypuobqaaxajjkhnqxx.supabase.co/storage/v1/object/public/media/calle-v3-mezcla.mp3";

/** Enlace de WhatsApp (placeholder; reemplazar con número/canal real). */
export const WHATSAPP_URL = "https://wa.me/";

/** Rutas principales del sitio (navbar + footer). */
export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/el-milagro", label: "El Milagro" },
  { href: "/prensa", label: "Prensa" },
  { href: "/compromisos", label: "Compromisos" },
  { href: "/mensaje-a-las-victimas", label: "Víctimas" },
  { href: "/equipo-salud", label: "Equipo de Salud" },
] as const;

export const ARCHIVO_LINK = {
  href: "/centro-de-documentacion",
  label: "Fuentes",
} as const;
