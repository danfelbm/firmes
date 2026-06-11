import type { Metadata } from "next";

import Badge from "@/components/Badge";
import CtaButton from "@/components/CtaButton";
import ExpedienteSection, {
  type SeccionExpediente,
} from "@/components/ExpedienteSection";
import Reveal from "@/components/Reveal";
import expedienteJson from "@/data/expediente-ddhh.json";

type Expediente = {
  titulo: string;
  secciones: SeccionExpediente[];
};

const expediente = expedienteJson as unknown as Expediente;

export const metadata: Metadata = {
  title: "El Expediente: DDHH y DIH",
  description:
    "Análisis en 7 frentes de las posiciones de Abelardo de la Espriella sobre derechos humanos y derecho internacional humanitario: JEP, Palestina y DIH, sistema internacional, uso de la fuerza, protesta, libertad de prensa y paz territorial.",
};

export default function ExpedienteDdhhPage() {
  return (
    <main>
      {/* Encabezado */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>Análisis jurídico · 7 frentes</Badge>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-white">
              El <span className="text-red">Expediente</span>
            </h1>
            <span
              className="mt-6 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              Qué ha dicho y propuesto el candidato sobre derechos humanos y
              derecho internacional humanitario — y qué queda en riesgo para
              ti, para las víctimas y para el país si llega a la Presidencia.
              Siete frentes, cada uno con sus dichos documentados y sus
              consecuencias.
            </p>
            <p className="mt-5 max-w-3xl text-sm font-medium text-white/60">
              {expediente.titulo}
            </p>
          </Reveal>

          {/* Índice de secciones */}
          <Reveal delay={120}>
            <nav aria-label="Índice del expediente">
              <ul className="mt-12 flex flex-wrap gap-3">
                {expediente.secciones.map((seccion, i) => (
                  <li key={seccion.id}>
                    <a
                      href={`#${seccion.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-navy-2/80 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-yellow hover:text-yellow"
                    >
                      <span className="text-xs font-bold text-yellow">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {seccion.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </section>

      {/* Las 7 secciones */}
      {expediente.secciones.map((seccion, i) => (
        <ExpedienteSection key={seccion.id} seccion={seccion} index={i} />
      ))}

      {/* Cierre */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-extrabold text-white">
              El expediente no termina aquí
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-muted">
              Escucha a quienes más tienen que perder y revisa, ficha por
              ficha, lo que el candidato propone para cada sector.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href="/la-voz-de-las-victimas" variant="red">
                La Voz de las Víctimas
              </CtaButton>
              <CtaButton href="/la-contracaja" variant="outline">
                La Contracaja
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
