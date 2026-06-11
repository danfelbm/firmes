import type { Metadata } from "next";

import Badge from "@/components/Badge";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import saludData from "@/data/salud.json";

export const metadata: Metadata = {
  title: "El Negocio de la Salud",
  description:
    "Dossier documentado: mientras Abelardo de la Espriella promete salvar la salud, su círculo cercano vive de los contratos del sistema. Casos, condenas y fuentes.",
};

type ItemSalud = {
  titulo: string;
  comentario: string | null;
  url: string;
  medio: string;
};

const items: ItemSalud[] = saludData.items;

export default function NegocioDeLaSaludPage() {
  return (
    <main>
      {/* Encabezado */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>Dossier · Salud</Badge>
            <h1 className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-white">
              El <span className="text-yellow">Negocio</span> de la Salud
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              Mientras el candidato promete que &ldquo;no se nos va a morir
              nadie por falta de medicamentos&rdquo;, su círculo cercano vive de
              los contratos del sistema de salud: su jefe de campaña fue
              condenado por irregularidades en un contrato de hospital, su mano
              derecha controla clínicas que reciben recursos públicos y su
              bufete contrata con el Estado. Aquí están los casos, documentados
              y con fuentes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid de casos */}
      <section className="bg-navy-2 section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item, i) => (
              <Reveal key={item.url} delay={(i % 2) * 80}>
                <article className="flex h-full flex-col rounded-xl border border-white/10 bg-navy/80 p-7 transition-transform duration-200 hover:-translate-y-1">
                  <span className="self-start rounded-full bg-blue/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-blue">
                    {item.medio}
                  </span>
                  <h2 className="yellow-tick mt-5 text-lg font-bold leading-snug text-white">
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
                    className="mt-auto pt-5 text-sm font-bold text-yellow transition-colors hover:text-white"
                  >
                    Ver la investigación <span aria-hidden="true">→</span>
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              Estos seis casos son parte de un archivo más grande: 123 fuentes
              documentadas sobre el candidato, organizadas por tema.
            </p>
            <div className="mt-9">
              <CtaButton href="/archivo" variant="yellow">
                Explorar todo el Archivo
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
