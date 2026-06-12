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

export const metadata: Metadata = {
  title: "Mensaje a las Víctimas",
  description:
    "El candidato tiene un mensaje directo para las víctimas del conflicto armado. Lo reproducimos sin editar, palabra por palabra, con sus fuentes.",
};

export default function MensajeALasVictimasPage() {
  return (
    <main>
      {/* Encabezado */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>El Tigre habla claro</Badge>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-ink">
              Mensaje a las <span className="bg-yellow px-2">Víctimas</span>
            </h1>
            <span
              className="mt-6 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              El candidato tiene un mensaje directo para las víctimas del
              conflicto armado. Lo reproducimos sin editar, palabra por
              palabra, con sus fuentes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Los 8 bloques */}
      <section className="bg-paper section-padding">
        <div className="mx-auto max-w-5xl space-y-8 px-6">
          {victimas.bloques.map((bloque, i) => (
            <Reveal key={bloque.fuenteUrl} delay={(i % 2) * 80}>
              <VictimaBlock bloque={bloque} numero={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* El programa y sus pequeños detalles */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold text-ink">
              El programa y sus pequeños{" "}
              <span className="bg-yellow px-2">detalles</span>
            </h2>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-6 max-w-2xl text-muted">
              Lo que propone el programa de gobierno, junto a las objeciones y
              comentarios de los abogados aguafiestas. Para que usted decida
              con toda la información.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <PropuestasRiesgosTable filas={victimas.tablaPropuestas} />
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-16 text-center">
              <CtaButton href="/compromisos" variant="red">
                Conozca nuestros compromisos
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
