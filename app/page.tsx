import Image from "next/image";

import CtaButton from "@/components/CtaButton";
import FichaCard from "@/components/FichaCard";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import QuickAccessBar from "@/components/QuickAccessBar";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";
import saludData from "@/data/salud.json";
import {
  getFichasDestacadas,
  getMediosYTemas,
  getNoticiasRecientes,
  getTemasEnlaces,
} from "@/lib/queries";

// ISR: el contenido editorial cambia poco; se refresca cada hora.
export const revalidate = 3600;

// Cita textual del candidato, documentada en data/expediente-ddhh.json
// (sección "Palestina y DIH", fuente: Publimetro, 13 ago 2025).
const citaExpediente =
  "El estado de Israel, el primer ministro Netanyahu, está haciendo lo que tiene que hacer para defender a su pueblo, y es lo mismo que voy a hacer yo para defender a Colombia. Cueste lo que cueste.";

const casosSalud = saludData.items.slice(0, 3);

export default async function Home() {
  const [fichas, noticias, { medios }, temasEnlaces] = await Promise.all([
    getFichasDestacadas(6),
    getNoticiasRecientes(3),
    getMediosYTemas(),
    getTemasEnlaces(),
  ]);
  const totalEnlaces = temasEnlaces.reduce((sum, t) => sum + t.count, 0);

  return (
    <main>
      <Hero />
      <QuickAccessBar />

      {/* El Milagro */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  kicker="31 sectores, 31 milagros"
                  title="El Milagro, sector por sector"
                  highlight="Milagro"
                />
                <p className="mt-6 max-w-2xl text-muted">
                  La palabra del Tigre explicada con el cariño que merece: lo
                  que dijo, lo que significa en cristiano y lo que le toca a
                  usted. Transparencia total.
                </p>
              </div>
              <figure className="card-shadow overflow-hidden rounded-2xl border border-ink/10 bg-paper">
                <Image
                  src="/abelardo/milagro.webp"
                  alt="Abelardo de la Espriella presentando sus propuestas"
                  width={1200}
                  height={675}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fichas.map((ficha, i) => (
              <Reveal key={ficha.slug} delay={i * 80}>
                <FichaCard
                  sector={ficha.sector}
                  pregunta={ficha.pregunta}
                  icono={ficha.icono}
                  slug={ficha.slug}
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-12 text-center">
              <CtaButton href="/el-milagro" variant="yellow">
                Ver los 31 milagros
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prensa */}
      <section className="bg-paper section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <figure className="card-shadow order-last overflow-hidden rounded-2xl border border-ink/10 bg-paper lg:order-first">
                <Image
                  src="/abelardo/medios.webp"
                  alt="Abelardo de la Espriella durante una entrevista"
                  width={1024}
                  height={512}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="h-full w-full object-cover"
                />
              </figure>
              <div>
                <SectionHeading
                  kicker="18 años haciendo historia"
                  title="El Tigre en los Medios"
                  highlight="Medios"
                  highlightColor="blue"
                />
                <p className="mt-6 max-w-2xl text-muted">
                  52 artículos nos han dedicado los principales medios del país
                  desde 2008. Nadie genera tanta conversación. Los reproducimos
                  completos, con gratitud.
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {noticias.map((noticia, i) => (
              <Reveal key={noticia.slug} delay={i * 80}>
                <NewsCard
                  titular={noticia.titular}
                  medio={noticia.medio ?? "Prensa"}
                  fecha={noticia.fecha ?? noticia.created_at}
                  resumen={noticia.resumen}
                  link={noticia.link}
                  compacto
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={160}>
            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
              <StatCounter value="52" label="Artículos nos dedicaron" />
              <StatCounter value="18" label="Años en los medios" />
              <StatCounter
                value={`${medios.length}`}
                label="Medios hablan del Tigre"
              />
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-12 text-center">
              <CtaButton href="/prensa" variant="outline">
                Visitar la sala de prensa
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Banner Compromisos: bloque oscuro de acento sobre fondo claro */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border-2 border-red bg-navy-3 px-8 py-14 text-center md:px-16">
              <Image
                src="/abelardo/cita-bg.webp"
                alt=""
                fill
                aria-hidden="true"
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-top"
              />
              <div
                className="absolute inset-0 bg-navy-3/85"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-widest text-red">
                  El Tigre ha hablado
                </p>
              <blockquote className="mx-auto mt-6 max-w-3xl text-[clamp(1.25rem,2.6vw,2rem)] font-extrabold leading-snug text-white">
                <span className="text-yellow" aria-hidden="true">
                  &ldquo;
                </span>
                {citaExpediente}
                <span className="text-yellow" aria-hidden="true">
                  &rdquo;
                </span>
              </blockquote>
              {/* white/70 en lugar de text-muted: la caja sigue siendo navy-3 */}
              <p className="mt-5 text-sm font-medium text-white/70">
                — Abelardo de la Espriella, agosto de 2025 (Publimetro).
                Palabra entregada con la solemnidad que el momento exige · 7
                compromisos documentados.
              </p>
                <div className="mt-9">
                  <CtaButton href="/compromisos" variant="red">
                    Conozca nuestros compromisos
                  </CtaButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Equipo de salud */}
      <section className="bg-paper section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              kicker="El equipo del Milagro"
              title="Nuestros Aliados en la Salud"
              highlight="Aliados"
            />
            <p className="mt-6 max-w-2xl text-muted">
              El Milagro de la Salud se hace con un equipo de amplia
              experiencia — tan notable que la gran prensa nacional le ha
              dedicado investigaciones completas.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {casosSalud.map((caso, i) => (
              <Reveal key={caso.url} delay={i * 80}>
                <article className="card-shadow flex h-full flex-col rounded-xl border border-ink/10 bg-paper p-7 transition-transform duration-200 hover:-translate-y-1">
                  <span className="self-start rounded-full bg-blue/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-blue">
                    {caso.medio}
                  </span>
                  <h3 className="yellow-tick mt-5 flex-1 text-lg font-bold leading-snug text-ink">
                    {caso.titulo}
                  </h3>
                  <a
                    href={caso.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-5 text-sm font-bold text-blue transition-colors hover:text-red"
                  >
                    Ver el reconocimiento de la prensa{" "}
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={220}>
            <div className="mt-12 text-center">
              <CtaButton href="/equipo-salud" variant="outline">
                Conozca al equipo
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Centro de Documentación */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              kicker="Transparencia total"
              title="Centro de Documentación de la Patria"
              highlight="Documentación"
            />
            <p className="mt-6 max-w-2xl text-muted">
              {totalEnlaces} fuentes organizadas por tema para su consulta.
              Aquí no se esconde nada.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap gap-3">
              {temasEnlaces.map(({ tema, count }) => (
                <span
                  key={tema}
                  className="card-shadow rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm font-semibold text-ink"
                >
                  {tema}{" "}
                  <span className="font-bold text-blue">({count})</span>
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-14 flex flex-col items-center gap-8">
              <StatCounter
                value={`${totalEnlaces}`}
                label="Fuentes a su disposición"
              />
              <CtaButton href="/centro-de-documentacion" variant="red">
                Visitar el Centro de Documentación
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ruge la Calle */}
      <section className="bg-paper section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 px-6 py-20 text-center md:px-16">
              <Image
                src="/abelardo/calle-bg.webp"
                alt=""
                fill
                aria-hidden="true"
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-navy/80"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow">
                  La calle ya canta
                </p>
                <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-extrabold uppercase text-white">
                  Ruge la{" "}
                  <span className="bg-yellow px-2 text-ink">Calle</span>
                </h2>
                <p className="mx-auto mt-8 text-lg leading-relaxed text-white/80">
                  <strong className="text-white">CALLE</strong> es el sonido
                  de este momento histórico. Pulse play en el reproductor y
                  escuche lo que se canta ahí afuera.
                </p>
                <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-yellow">
                  El reproductor vive abajo a la izquierda — pulse play y siga
                  leyendo.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
