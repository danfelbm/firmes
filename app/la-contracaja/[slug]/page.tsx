import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Badge from "@/components/Badge";
import CtaButton from "@/components/CtaButton";
import FichaTriangulo from "@/components/FichaTriangulo";
import Reveal from "@/components/Reveal";
import { getFichaBySlug, getFichas } from "@/lib/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const fichas = await getFichas();
  return fichas.map((ficha) => ({ slug: ficha.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ficha = await getFichaBySlug(slug);
  if (!ficha) return { title: "Ficha no encontrada — La Contracaja" };
  return {
    title: `${ficha.sector} — La Contracaja`,
    description: ficha.pregunta,
  };
}

export default async function FichaPage({ params }: PageProps) {
  const { slug } = await params;
  const ficha = await getFichaBySlug(slug);
  if (!ficha) notFound();

  const fichas = await getFichas();
  const idx = fichas.findIndex((f) => f.slug === ficha.slug);
  const anterior = idx > 0 ? fichas[idx - 1] : null;
  const siguiente = idx >= 0 && idx < fichas.length - 1 ? fichas[idx + 1] : null;

  return (
    <main className="bg-navy">
      <article className="section-padding mx-auto max-w-4xl px-6">
        <Reveal>
          <nav aria-label="Miga de pan">
            <Link
              href="/la-contracaja"
              className="text-sm font-bold text-yellow transition-colors hover:text-white"
            >
              <span aria-hidden="true">←</span> La Contracaja
            </Link>
          </nav>

          <header className="mt-8">
            <Badge>{`Ficha N°${ficha.orden} de 31`}</Badge>
            <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-tight text-white">
              {ficha.sector}
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-6 text-xl leading-relaxed text-muted italic sm:text-2xl">
              {ficha.pregunta}
            </p>
          </header>
        </Reveal>

        <Reveal delay={140} className="mt-12">
          <FichaTriangulo ficha={ficha} />
        </Reveal>

        {anterior || siguiente ? (
          <nav
            aria-label="Otras fichas"
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {anterior ? (
              <Link
                href={`/la-contracaja/${anterior.slug}`}
                className="group rounded-xl border border-white/10 bg-navy-2/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-yellow/40"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-muted">
                  <span aria-hidden="true">←</span> Ficha anterior
                </span>
                <span className="mt-2 block font-bold text-white transition-colors group-hover:text-yellow">
                  {anterior.sector}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {siguiente ? (
              <Link
                href={`/la-contracaja/${siguiente.slug}`}
                className="group rounded-xl border border-white/10 bg-navy-2/80 p-5 text-right transition-all duration-200 hover:-translate-y-1 hover:border-yellow/40 sm:col-start-2"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-muted">
                  Ficha siguiente <span aria-hidden="true">→</span>
                </span>
                <span className="mt-2 block font-bold text-white transition-colors group-hover:text-yellow">
                  {siguiente.sector}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        <div className="mt-14 text-center">
          <CtaButton href="/hemeroteca" variant="outline">
            Explorar la Hemeroteca
          </CtaButton>
        </div>
      </article>
    </main>
  );
}
