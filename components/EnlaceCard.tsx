import ObservacionLarga from "@/components/ObservacionLarga";
import {
  categoriaDeRecurso,
  dominioDe,
  ICONOS_POR_CATEGORIA,
} from "@/lib/enlaces";
import type { Enlace } from "@/lib/queries";

type EnlaceCardProps = {
  enlace: Enlace;
};

function formatearFecha(fecha: string | null): string | null {
  if (!fecha) return null;
  return new Date(fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EnlaceCard({ enlace }: EnlaceCardProps) {
  const categoria = categoriaDeRecurso(enlace);
  const Icon = ICONOS_POR_CATEGORIA[categoria];
  const dominio = dominioDe(enlace.url);
  const fechaFormateada = formatearFecha(enlace.fecha);

  // Las "notas" del archivo (filas de contexto sin URL en la fuente) se
  // muestran como texto no clickeable, con acento amarillo.
  if (!enlace.url) {
    return (
      <div className="flex items-start gap-4 rounded-xl border border-yellow/60 bg-yellow/10 p-5">
        <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow text-ink">
          <Icon size={18} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-[0.6rem] font-bold uppercase tracking-wide text-ink">
            Nota del archivo
          </span>
          <span className="mt-1 block font-semibold leading-snug text-ink">
            {enlace.titulo}
          </span>
          {enlace.observacion ? (
            <ObservacionLarga
              texto={enlace.observacion}
              className="mt-1.5 block text-sm leading-relaxed text-muted"
            />
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
      className="card-shadow group flex items-start gap-4 rounded-xl border border-ink/10 bg-paper p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow/60"
    >
      <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-blue text-white">
        <Icon size={18} strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-ink">
            {categoria}
          </span>
          {fechaFormateada ? (
            <time
              dateTime={enlace.fecha ?? undefined}
              className="text-xs font-medium text-muted"
            >
              {fechaFormateada}
            </time>
          ) : null}
        </span>
        <span className="mt-1.5 block font-semibold leading-snug text-ink transition-colors group-hover:text-blue">
          {enlace.titulo}
        </span>
        {enlace.observacion ? (
          <ObservacionLarga
            texto={enlace.observacion}
            className="mt-1.5 block text-sm leading-relaxed text-muted"
          />
        ) : null}
        {dominio ? (
          <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-blue transition-colors group-hover:text-red">
            Ver en {dominio}
            <span aria-hidden="true">→</span>
          </span>
        ) : (
          <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-blue transition-colors group-hover:text-red">
            Abrir fuente
            <span aria-hidden="true">→</span>
          </span>
        )}
      </span>
    </a>
  );
}
