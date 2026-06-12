import type { Metadata } from "next";

import Badge from "@/components/Badge";
import FichaCard from "@/components/FichaCard";
import Reveal from "@/components/Reveal";
import { getFichas } from "@/lib/queries";

export const metadata: Metadata = {
  title: "El Milagro, sector por sector",
  description:
    "Los 31 milagros del Tigre, sector por sector: su palabra textual, la explicación en cristiano y lo que le toca a usted. Con fuentes que dan fe. Transparencia total.",
};

export default async function ElMilagroPage() {
  const fichas = await getFichas();

  return (
    <main className="bg-navy">
      <section className="section-padding mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <Badge>Colombia Patria Milagro</Badge>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-tight text-white">
              El <span className="text-yellow">Milagro</span>, sector por
              sector
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              La palabra del Tigre explicada con el cariño que merece:{" "}
              <strong className="font-bold text-yellow">lo que dijo</strong>,
              con sus propias palabras; lo que significa{" "}
              <strong className="font-bold text-blue">en cristiano</strong>; y{" "}
              <strong className="font-bold text-red">
                lo que le toca a usted
              </strong>{" "}
              en su vida diaria. 31 sectores, 31 milagros, con las fuentes que
              dan fe. Transparencia total.
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
