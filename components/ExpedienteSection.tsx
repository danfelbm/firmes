import { Info, Megaphone, ShieldAlert } from "lucide-react";

import Reveal from "./Reveal";

export type SeccionExpediente = {
  id: string;
  titulo: string;
  dichos: string[];
  riesgos: string[];
  cita: string | null;
  notaCierre: string | null;
};

type ExpedienteSectionProps = {
  seccion: SeccionExpediente;
  index: number;
};

export default function ExpedienteSection({
  seccion,
  index,
}: ExpedienteSectionProps) {
  const numero = String(index + 1).padStart(2, "0");
  const bg = index % 2 === 0 ? "bg-navy" : "bg-navy-2";

  return (
    <section
      id={seccion.id}
      className={`${bg} section-padding scroll-mt-24`}
      aria-labelledby={`${seccion.id}-titulo`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex items-baseline gap-5">
            <span
              className="text-[clamp(3rem,7vw,5rem)] font-extrabold leading-none text-white/10"
              aria-hidden="true"
            >
              {numero}
            </span>
            <h2
              id={`${seccion.id}-titulo`}
              className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-extrabold text-white"
            >
              {seccion.titulo}
            </h2>
          </div>
          <span
            className="mt-5 block h-1 w-14 rounded-full bg-yellow"
            aria-hidden="true"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Nuestra palabra */}
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red">
                <Megaphone size={16} strokeWidth={2.5} aria-hidden="true" />
                Nuestra palabra
              </p>
              <ul className="mt-6 space-y-5">
                {seccion.dichos.map((dicho) => (
                  <li key={dicho} className="flex gap-3">
                    <span
                      className="mt-2 size-2.5 shrink-0 rounded-[2px] bg-red"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-white/85">
                      {dicho}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lo que advierten los enemigos de la patria */}
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue">
                <ShieldAlert size={16} strokeWidth={2.5} aria-hidden="true" />
                Lo que advierten los enemigos de la patria
              </p>
              <ul className="mt-6 space-y-5">
                {seccion.riesgos.map((riesgo) => (
                  <li key={riesgo} className="flex gap-3">
                    <span
                      className="mt-2 size-2.5 shrink-0 rounded-[2px] bg-blue"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-muted">
                      {riesgo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {seccion.cita ? (
          <Reveal delay={140}>
            <blockquote className="relative mt-12 border-l-4 border-yellow bg-navy-3/60 px-8 py-8 md:px-12">
              <span
                className="pointer-events-none absolute -top-4 left-4 text-[5rem] font-extrabold leading-none text-yellow/80"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="relative text-[clamp(1.1rem,2.2vw,1.5rem)] font-bold leading-snug text-white">
                {seccion.cita}
              </p>
            </blockquote>
          </Reveal>
        ) : null}

        {seccion.notaCierre ? (
          <Reveal delay={180}>
            <div className="mt-10 flex gap-4 rounded-xl bg-yellow p-6 text-ink md:p-8">
              <Info
                size={24}
                strokeWidth={2.25}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">
                  Nota de los abogados aguafiestas
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed md:text-base">
                  {seccion.notaCierre}
                </p>
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
