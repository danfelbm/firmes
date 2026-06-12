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

/**
 * Complemento del título "El Milagro …" con el artículo correcto por sector.
 * Para slugs no contemplados se cae al formato neutro "de: SECTOR".
 */
const COMPLEMENTO_MILAGRO: Record<string, string> = {
  "adulto-mayor": "del Adulto Mayor",
  afros: "de los Afros",
  ambiente: "del Ambiente",
  animales: "de los Animales",
  "artes-culturas-y-saberes": "de las Artes, las Culturas y los Saberes",
  "cambio-climatico": "del Cambio Climático",
  campesinado: "del Campesinado",
  "ciencia-y-tecnologia": "de la Ciencia y la Tecnología",
  "derechos-humanos": "de los Derechos Humanos",
  discapacidad: "de la Discapacidad",
  drogas: "de las Drogas",
  economia: "de la Economía",
  educacion: "de la Educación",
  "funcion-publica": "de la Función Pública",
  "gestion-del-riesgo": "de la Gestión del Riesgo",
  indigenas: "de los Pueblos Indígenas",
  "infraestructura-y-transporte": "de la Infraestructura y el Transporte",
  internacional: "Internacional",
  interreligioso: "Interreligioso",
  jovenes: "de los Jóvenes",
  lgbti: "LGBTI",
  "lucha-contra-la-corrupcion": "de la Lucha contra la Corrupción",
  mujeres: "de las Mujeres",
  "ninez-y-adolescencia": "de la Niñez y la Adolescencia",
  "participacion-e-innovacion-reforma-politica-reforma-a-la-justicia":
    "de la Participación, la Reforma Política y la Justicia",
  "revolucion-urbana-y-vivienda": "de la Revolución Urbana y la Vivienda",
  salud: "de la Salud",
  seguridad: "de la Seguridad",
  "transicion-energetica": "de la Transición Energética",
  turismo: "del Turismo",
  victimas: "de las Víctimas",
};

function tituloMilagro(slug: string, sector: string): string {
  const complemento = COMPLEMENTO_MILAGRO[slug] ?? `de: ${sector}`;
  return `El Milagro ${complemento}`;
}

export async function generateStaticParams() {
  const fichas = await getFichas();
  return fichas.map((ficha) => ({ slug: ficha.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ficha = await getFichaBySlug(slug);
  if (!ficha) return { title: "Milagro no encontrado — El Milagro" };
  return {
    title: tituloMilagro(ficha.slug, ficha.sector),
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
    <main className="bg-cream">
      <article className="section-padding mx-auto max-w-4xl px-6">
        <Reveal>
          <nav aria-label="Miga de pan">
            <Link
              href="/el-milagro"
              className="text-sm font-bold text-blue transition-colors hover:text-red"
            >
              <span aria-hidden="true">←</span> El Milagro
            </Link>
          </nav>

          <header className="mt-8">
            <Badge>{`Milagro N°${ficha.orden} de 31`}</Badge>
            <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-tight text-ink">
              {tituloMilagro(ficha.slug, ficha.sector)}
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
            aria-label="Otros milagros"
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {anterior ? (
              <Link
                href={`/el-milagro/${anterior.slug}`}
                className="card-shadow group rounded-xl border border-ink/10 bg-paper p-5 transition-all duration-200 hover:-translate-y-1 hover:border-yellow/60"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-muted">
                  <span aria-hidden="true">←</span> Milagro anterior
                </span>
                <span className="mt-2 block font-bold text-ink transition-colors group-hover:text-blue">
                  {anterior.sector}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {siguiente ? (
              <Link
                href={`/el-milagro/${siguiente.slug}`}
                className="card-shadow group rounded-xl border border-ink/10 bg-paper p-5 text-right transition-all duration-200 hover:-translate-y-1 hover:border-yellow/60 sm:col-start-2"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-muted">
                  Milagro siguiente <span aria-hidden="true">→</span>
                </span>
                <span className="mt-2 block font-bold text-ink transition-colors group-hover:text-blue">
                  {siguiente.sector}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        <div className="mt-14 text-center">
          <CtaButton href="/prensa" variant="outline">
            El Tigre en los medios
          </CtaButton>
        </div>
      </article>
    </main>
  );
}
