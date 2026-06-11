import type { Metadata } from "next";

import Badge from "@/components/Badge";
import FichaCard from "@/components/FichaCard";
import Reveal from "@/components/Reveal";
import { getFichas } from "@/lib/queries";

export const metadata: Metadata = {
  title: "La Contracaja",
  description:
    "31 fichas sectoriales que desmontan el discurso de Abelardo de la Espriella: lo que dice vs. lo que significa para tu vida, sector por sector.",
};

export default async function LaContracajaPage() {
  const fichas = await getFichas();

  return (
    <main className="bg-navy">
      <section className="section-padding mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <Badge>31 fichas sectoriales</Badge>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-tight text-white">
              La <span className="text-yellow">Contracaja</span>
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Cada ficha desarma el discurso con un método triangular:{" "}
              <strong className="font-bold text-yellow">lo que dice</strong>{" "}
              Abelardo con sus propias palabras, la{" "}
              <strong className="font-bold text-blue">
                traducción pedagógica
              </strong>{" "}
              de lo que realmente propone y el{" "}
              <strong className="font-bold text-red">impacto cotidiano</strong>{" "}
              que tendría en tu vida. 31 sectores, con fuentes verificables.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fichas.map((ficha, i) => (
            <Reveal key={ficha.id} delay={(i % 6) * 70} className="h-full">
              <FichaCard
                sector={ficha.sector}
                pregunta={ficha.pregunta}
                icono={ficha.icono}
                slug={ficha.slug}
              />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
