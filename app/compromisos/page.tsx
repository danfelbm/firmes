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
  title: "Los Compromisos del Tigre",
  description:
    "La visión del Tigre sobre los derechos humanos, la justicia y el lugar de Colombia en el mundo, punto por punto — junto con las advertencias de quienes no la comparten, para que usted decida con toda la información.",
};

export default function CompromisosPage() {
  return (
    <main>
      {/* Encabezado */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>Nuestra visión del mundo</Badge>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-white">
              Los <span className="text-red">Compromisos</span> del Tigre
            </h1>
            <span
              className="mt-6 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              El Tigre tiene una visión clara sobre los derechos humanos, la
              justicia y el lugar de Colombia en el mundo. La presentamos punto
              por punto — junto con las advertencias de quienes no la
              comparten, para que usted decida con toda la información.
            </p>
            <p className="mt-5 max-w-3xl text-sm font-medium text-white/60">
              {expediente.titulo}
            </p>
          </Reveal>

          {/* Índice de secciones */}
          <Reveal delay={120}>
            <nav aria-label="Índice de los compromisos">
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
              La palabra del Tigre no termina aquí
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-muted">
              Conozca el mensaje del candidato para las víctimas del conflicto
              y recorra el Milagro, sector por sector.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href="/mensaje-a-las-victimas" variant="red">
                Mensaje a las Víctimas
              </CtaButton>
              <CtaButton href="/el-milagro" variant="outline">
                El Milagro
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
