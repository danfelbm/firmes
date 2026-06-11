import { ExternalLink } from "lucide-react";

export type BloqueVictima = {
  titulo: string;
  cita: string | null;
  fuenteUrl: string;
  anotacion: string | null;
};

type VictimaBlockProps = {
  bloque: BloqueVictima;
  numero: number;
};

export default function VictimaBlock({ bloque, numero }: VictimaBlockProps) {
  const num = String(numero).padStart(2, "0");

  return (
    <article className="rounded-2xl border border-white/10 bg-navy-2/80 p-8 md:p-10">
      <div className="flex items-start gap-5">
        <span
          className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-none text-white/10"
          aria-hidden="true"
        >
          {num}
        </span>
        <h2 className="text-xl font-bold leading-snug text-white md:text-2xl">
          {bloque.titulo}
        </h2>
      </div>

      {bloque.cita ? (
        <blockquote className="relative mt-8 border-l-4 border-red pl-6 md:pl-8">
          <span
            className="pointer-events-none absolute -top-3 -left-1 text-[3.5rem] font-extrabold leading-none text-yellow/80"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p className="relative whitespace-pre-line text-base font-semibold leading-relaxed text-white/90 md:text-lg">
            {bloque.cita}
          </p>
        </blockquote>
      ) : null}

      {bloque.anotacion ? (
        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-widest text-blue">
            Anotación
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
            {bloque.anotacion}
          </p>
        </div>
      ) : null}

      <a
        href={bloque.fuenteUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-yellow transition-colors hover:text-white"
      >
        Ver la fuente original
        <ExternalLink size={15} strokeWidth={2.5} aria-hidden="true" />
      </a>
    </article>
  );
}
