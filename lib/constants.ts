// Constantes globales del sitio "Firmes por la Patria".

export const SITE_NAME = "Firmes por la Patria";

/**
 * URL pública del audio "CALLE" (Supabase Storage, bucket `media`).
 * Placeholder vacío: mientras esté vacío, el AudioDock NO se renderiza.
 * Fase de contenido la reemplaza por la URL real.
 */
export const AUDIO_CALLE_URL = "";

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
