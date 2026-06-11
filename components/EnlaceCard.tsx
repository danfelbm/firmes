import {
  FileText,
  Image as ImageIcon,
  Link2,
  Play,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

import type { Enlace } from "@/lib/queries";

/**
 * Mapa explícito clave → icono. El campo `tipo` en la tabla `enlaces` es
 * texto libre ("Video", "Vídeo declaración…", "Documento", "Video Facebook",
 * etc.), así que `claveDeTipo` lo normaliza a una clave por inclusión de
 * palabras. Fallback: Link2.
 */
const iconosPorClave: Record<string, LucideIcon> = {
  video: Play,
  documento: FileText,
  imagen: ImageIcon,
  enlace: Link2,
};

const clavesPorPalabra: [string, string][] = [
  ["video", "video"],
  ["vídeo", "video"],
  ["youtube", "video"],
  ["tiktok", "video"],
  ["documento", "documento"],
  ["columna", "documento"],
  ["programa de gobierno", "documento"],
  ["imagen", "imagen"],
  ["foto", "imagen"],
];

function claveDeTipo(tipo: string | null): string {
  if (!tipo) return "enlace";
  const t = tipo.toLowerCase();
  const entrada = clavesPorPalabra.find(([palabra]) => t.includes(palabra));
  return entrada ? entrada[1] : "enlace";
}

function dominioDe(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

type EnlaceCardProps = {
  enlace: Enlace;
};

export default function EnlaceCard({ enlace }: EnlaceCardProps) {
  const Icon = iconosPorClave[claveDeTipo(enlace.tipo)] ?? Link2;
  const dominio = dominioDe(enlace.url);
  const fechaFormateada = enlace.fecha
    ? new Date(enlace.fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Las "notas" del archivo (filas de contexto sin URL en la fuente) se
  // muestran como texto no clickeable, con acento amarillo.
  if (!enlace.url) {
    return (
      <div className="flex items-start gap-4 rounded-xl border border-yellow/25 bg-navy-3/60 p-5">
        <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow text-ink">
          <StickyNote size={18} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-[0.6rem] font-bold uppercase tracking-wide text-yellow">
            Nota del archivo
          </span>
          <span className="mt-1 block font-semibold leading-snug text-white">
            {enlace.titulo}
          </span>
          {enlace.observacion ? (
            <span className="mt-1.5 block text-sm leading-relaxed text-muted">
              {enlace.observacion}
            </span>
          ) : null}
        </span>
      </div>
    );
  }

  return (
    <a
      href={enlace.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex items-start gap-4 rounded-xl border border-white/10 bg-navy-2/80 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow/40"
    >
      <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-blue text-white">
        <Icon size={18} strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {fechaFormateada ? (
            <time
              dateTime={enlace.fecha ?? undefined}
              className="text-xs font-medium text-muted"
            >
              {fechaFormateada}
            </time>
          ) : null}
          {dominio ? (
            <span className="rounded-full bg-blue/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-blue">
              {dominio}
            </span>
          ) : null}
        </span>
        <span className="mt-1.5 block font-semibold leading-snug text-white transition-colors group-hover:text-yellow">
          {enlace.titulo}
        </span>
        {enlace.observacion ? (
          <span className="mt-1.5 block text-sm leading-relaxed text-muted">
            {enlace.observacion}
          </span>
        ) : null}
      </span>
      <span
        className="mt-1 shrink-0 text-sm font-bold text-yellow opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  );
}
