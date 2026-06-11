import type { Metadata } from "next";

import Badge from "@/components/Badge";
import CtaButton from "@/components/CtaButton";
import PropuestasRiesgosTable, {
  type FilaPropuesta,
} from "@/components/PropuestasRiesgosTable";
import Reveal from "@/components/Reveal";
import VictimaBlock, { type BloqueVictima } from "@/components/VictimaBlock";
import victimasJson from "@/data/victimas.json";

type Victimas = {
  intro: string | null;
  bloques: BloqueVictima[];
  tablaPropuestas: FilaPropuesta[];
};

const victimas = victimasJson as unknown as Victimas;

const introFallback =
  "Más de 9 millones de víctimas del conflicto armado han construido, durante años, caminos de verdad, justicia y reparación. Estas son las declaraciones y propuestas del candidato que ponen esos derechos en riesgo — con sus fuentes originales, palabra por palabra.";

export const metadata: Metadata = {
  title: "La Voz de las Víctimas",
  description:
    "Las declaraciones y propuestas de Abelardo de la Espriella que ponen en riesgo los derechos de más de 9 millones de víctimas del conflicto armado: 8 bloques documentados con fuentes y la tabla de propuestas vs. riesgos.",
};

export default function LaVozDeLasVictimasPage() {
  return (
    <main>
      {/* Encabezado */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>9+ millones de víctimas tienen memoria</Badge>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-white">
              La Voz de las <span className="text-yellow">Víctimas</span>
            </h1>
            <span
              className="mt-6 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              {victimas.intro ?? introFallback}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Los 8 bloques */}
      <section className="bg-navy-2 section-padding">
        <div className="mx-auto max-w-5xl space-y-8 px-6">
          {victimas.bloques.map((bloque, i) => (
            <Reveal key={bloque.fuenteUrl} delay={(i % 2) * 80}>
              <VictimaBlock bloque={bloque} numero={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Propuestas vs. riesgos */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold text-white">
              Propuestas vs. <span className="text-yellow">riesgos</span>
            </h2>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-6 max-w-2xl text-muted">
              Lo que el programa de gobierno propone, frente a los derechos
              que quedarían comprometidos.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <PropuestasRiesgosTable filas={victimas.tablaPropuestas} />
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-16 text-center">
              <CtaButton href="/expediente-ddhh" variant="red">
                Abrir el Expediente DDHH
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
