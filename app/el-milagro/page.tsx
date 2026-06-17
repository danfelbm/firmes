import type { Metadata } from "next";
import Image from "next/image";

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
    <main className="bg-cream">
      <section className="section-padding mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-3xl">
              <Badge>Colombia Patria Milagro</Badge>
              <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-tight text-ink">
                El <span className="bg-yellow px-2">Milagro</span>, sector por
                sector
              </h1>
              <span
                className="mt-5 block h-1 w-14 rounded-full bg-yellow"
                aria-hidden="true"
              />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                La palabra del Tigre explicada con el cariño que merece:{" "}
                <strong className="bg-yellow px-1 font-bold text-ink">
                  lo que dijo
                </strong>
                ,
                con sus propias palabras; lo que significa{" "}
                <strong className="font-bold text-blue">en cristiano</strong>; y{" "}
                <strong className="font-bold text-red">
                  lo que le toca a usted
                </strong>{" "}
                en su vida diaria. 31 sectores, 31 milagros, con las fuentes que
                dan fe. Transparencia total.
              </p>
            </div>
            <figure className="card-shadow overflow-hidden rounded-2xl border border-ink/10 bg-paper">
              <Image
                src="/abelardo/milagro-hdr.webp"
                alt="Abelardo de la Espriella en un acto de campaña"
                width={1280}
                height={720}
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="h-full w-full object-cover"
              />
            </figure>
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
