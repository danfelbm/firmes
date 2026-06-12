import type { Metadata } from "next";

import Badge from "@/components/Badge";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import saludData from "@/data/salud.json";

export const metadata: Metadata = {
  title: "Nuestros Aliados en la Salud",
  description:
    "Conozca a los hombres de confianza del Tigre y su amplia experiencia en el sistema de salud colombiano — experiencia tan notable que la gran prensa nacional les ha dedicado investigaciones completas. Las reproducimos con gratitud.",
};

type ItemSalud = {
  titulo: string;
  comentario: string | null;
  url: string;
  medio: string;
};

const items: ItemSalud[] = saludData.items;

export default function EquipoSaludPage() {
  return (
    <main>
      {/* Encabezado */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>El equipo del Milagro</Badge>
            <h1 className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-ink">
              Nuestros <span className="bg-yellow px-2">Aliados</span> en la
              Salud
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              El Milagro de la Salud no se hace solo: se hace con un equipo.
              Conozca a los hombres de confianza del Tigre y su amplia
              experiencia en el sistema de salud colombiano — experiencia tan
              notable que la gran prensa nacional les ha dedicado
              investigaciones completas. Las reproducimos aquí con gratitud.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid de casos */}
      <section className="bg-paper section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item, i) => (
              <Reveal key={item.url} delay={(i % 2) * 80}>
                <article className="card-shadow flex h-full flex-col rounded-xl border border-ink/10 bg-paper p-7 transition-transform duration-200 hover:-translate-y-1">
                  <span className="self-start rounded-full bg-blue/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-blue">
                    {item.medio}
                  </span>
                  <h2 className="yellow-tick mt-5 text-lg font-bold leading-snug text-ink">
                    {item.titulo}
                  </h2>
                  {item.comentario ? (
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {item.comentario}
                    </p>
                  ) : null}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-auto pt-5 text-sm font-bold text-blue transition-colors hover:text-red"
                  >
                    Ver el reconocimiento de la prensa{" "}
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              Estos reconocimientos hacen parte de una colección más amplia:
              todo lo que se ha publicado sobre el Tigre y su equipo, organizado
              por tema y a su disposición. Aquí no se esconde nada.
            </p>
            <div className="mt-9">
              <CtaButton href="/centro-de-documentacion" variant="yellow">
                Visitar el Centro de Documentación
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
