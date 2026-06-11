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
  { href: "/la-contracaja", label: "La Contracaja" },
  { href: "/hemeroteca", label: "Hemeroteca" },
  { href: "/expediente-ddhh", label: "Expediente DDHH" },
  { href: "/la-voz-de-las-victimas", label: "Víctimas" },
  { href: "/el-negocio-de-la-salud", label: "Salud" },
] as const;

export const ARCHIVO_LINK = { href: "/archivo", label: "El Archivo" } as const;
