import {
  BookOpen,
  Link as LinkIcon,
  Quote,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import type { Ficha } from "@/lib/queries";

type Bloque = {
  etiqueta: string;
  subtitulo?: string;
  texto: string;
  icon: LucideIcon;
  /** Clases de acento por color (texto, fondo del icono, borde superior). */
  labelClass: string;
  iconClass: string;
  borderClass: string;
  esCita?: boolean;
};

/** Extrae el dominio de una URL para destacarlo; null si no es URL válida. */
function getDominio(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * El método triangular del Milagro: palabra del Tigre → en cristiano →
 * lo que le toca a usted, más las fuentes que dan fe.
 */
export default function FichaTriangulo({ ficha }: { ficha: Ficha }) {
  const fuentes = (Array.isArray(ficha.fuentes) ? ficha.fuentes : []).filter(
    (f): f is string => typeof f === "string" && f.length > 0,
  );

  const bloques: Bloque[] = [
    {
      // El amarillo no funciona como color de texto sobre claro: la etiqueta
      // va en ink y el acento amarillo vive en el icono y el borde superior.
      etiqueta: "Palabra del Tigre",
      texto: ficha.lo_que_dice,
      icon: Quote,
      labelClass: "text-ink",
      iconClass: "bg-yellow text-ink",
      borderClass: "border-t-yellow",
      esCita: true,
    },
    {
      etiqueta: "En cristiano",
      subtitulo: "Lo que significa, explicado con cariño",
      texto: ficha.traduccion,
      icon: BookOpen,
      labelClass: "text-blue",
      iconClass: "bg-blue/15 text-blue",
      borderClass: "border-t-blue",
    },
    {
      etiqueta: "Lo que le toca a usted",
      subtitulo: "El milagro aplicado a su vida",
      texto: ficha.impacto,
      icon: TriangleAlert,
      labelClass: "text-red",
      iconClass: "bg-red/15 text-red",
      borderClass: "border-t-red",
    },
  ];

  return (
    <div className="flex flex-col">
      {bloques.map((bloque, i) => {
        const Icon = bloque.icon;
        return (
          <div key={bloque.etiqueta} className="flex flex-col">
            {i > 0 ? (
              <span
                className="mx-auto h-8 w-px bg-ink/15"
                aria-hidden="true"
              />
            ) : null}
            <section
              className={`card-shadow rounded-xl border border-ink/10 border-t-2 bg-paper p-7 sm:p-8 ${bloque.borderClass}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full ${bloque.iconClass}`}
                >
                  <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <div>
                  <h2
                    className={`text-xs font-bold uppercase tracking-widest ${bloque.labelClass}`}
                  >
                    {bloque.etiqueta}
                  </h2>
                  {bloque.subtitulo ? (
                    <p className="mt-0.5 text-sm font-semibold text-ink">
                      {bloque.subtitulo}
                    </p>
                  ) : null}
                </div>
              </div>
              {bloque.esCita ? (
                <blockquote className="mt-5 border-l-2 border-yellow pl-5 text-base leading-relaxed text-ink/90 italic whitespace-pre-line">
                  {bloque.texto}
                </blockquote>
              ) : (
                <p className="mt-5 text-base leading-relaxed text-muted whitespace-pre-line">
                  {bloque.texto}
                </p>
              )}
            </section>
          </div>
        );
      })}

      {fuentes.length > 0 ? (
        <>
          <span className="mx-auto h-8 w-px bg-ink/15" aria-hidden="true" />
          <section className="card-shadow rounded-xl border border-ink/10 bg-paper p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-muted">
                <LinkIcon size={20} strokeWidth={2.25} aria-hidden="true" />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
                Fuentes que dan fe
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {fuentes.map((url) => {
                const dominio = getDominio(url);
                return (
                  <li key={url} className="text-sm leading-relaxed">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="group inline-flex flex-col gap-0.5"
                    >
                      {dominio ? (
                        <span className="font-bold text-blue transition-colors group-hover:text-red">
                          {dominio} <span aria-hidden="true">↗</span>
                        </span>
                      ) : null}
                      <span className="break-all text-muted underline decoration-ink/20 underline-offset-2 transition-colors group-hover:text-ink">
                        {url}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}
