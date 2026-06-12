import type { Metadata } from "next";

import Badge from "@/components/Badge";
import NewsCard from "@/components/NewsCard";
import NewsFilters from "@/components/NewsFilters";
import Pagination from "@/components/Pagination";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import { getMediosYTemas, getNoticias } from "@/lib/queries";

export const metadata: Metadata = {
  title: "El Tigre en los Medios",
  description:
    "Desde 2008, los principales medios del país le han dedicado al Tigre 52 artículos, columnas e investigaciones. Los reproducimos completos, con sus fuentes, con gratitud.",
};

const PER_PAGE = 12;
const ANIO_MIN = 2008;
const ANIO_MAX = 2026;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Toma el primer valor cuando el parámetro llega repetido. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PrensaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const q = first(sp.q)?.trim() || undefined;
  const medio = first(sp.medio) || undefined;
  const tema = first(sp.tema) || undefined;
  const anioRaw = Number.parseInt(first(sp.anio) ?? "", 10);
  const anio = anioRaw >= ANIO_MIN && anioRaw <= ANIO_MAX ? anioRaw : undefined;
  const pageRaw = Number.parseInt(first(sp.page) ?? "1", 10);
  const page = Number.isInteger(pageRaw) && pageRaw > 1 ? pageRaw : 1;

  const [{ rows, total }, { medios, temas }] = await Promise.all([
    getNoticias({ q, medio, tema, anio, page, perPage: PER_PAGE }),
    getMediosYTemas(),
  ]);

  const anios = Array.from(
    { length: ANIO_MAX - ANIO_MIN + 1 },
    (_, i) => ANIO_MAX - i,
  );

  // Filtros activos que la paginación debe conservar en sus links.
  const filtrosActivos = {
    q,
    medio,
    tema,
    anio: anio !== undefined ? String(anio) : undefined,
  };

  return (
    <main>
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>Sala de prensa · 2008–2026</Badge>
            <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-white">
              El Tigre en los <span className="text-blue">Medios</span>
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-6 max-w-2xl text-muted">
              Desde 2008, los principales medios del país le han dedicado al
              Tigre 52 artículos, columnas e investigaciones. Una figura que no
              deja a nadie indiferente. Los reproducimos completos, con sus
              fuentes, con gratitud.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
              <StatCounter value="52" label="Artículos nos dedicaron" />
              <StatCounter value="18" label="Años en los medios" />
              <StatCounter
                value={String(medios.length)}
                label="Medios hablan del Tigre"
              />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-14">
              <NewsFilters medios={medios} temas={temas} anios={anios} />
            </div>
          </Reveal>

          {rows.length > 0 ? (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rows.map((noticia, i) => (
                  <Reveal key={noticia.slug} delay={(i % 3) * 80}>
                    <NewsCard
                      titular={noticia.titular}
                      medio={noticia.medio ?? "Prensa"}
                      fecha={noticia.fecha ?? noticia.created_at}
                      resumen={
                        noticia.resumen.trim()
                          ? noticia.resumen
                          : "Resumen no disponible — abra la nota original."
                      }
                      link={noticia.link}
                    />
                  </Reveal>
                ))}
              </div>
              <Pagination
                total={total}
                page={page}
                perPage={PER_PAGE}
                baseHref="/prensa"
                searchParams={filtrosActivos}
              />
            </>
          ) : (
            <div className="mt-10 rounded-xl border border-white/10 bg-navy-2/60 px-8 py-20 text-center">
              <p className="text-2xl font-extrabold text-white">
                Ni los enemigos de la patria encontraron algo con esos filtros.
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                Pruebe con otro término de búsqueda, cambie de medio o de año,
                o limpie los filtros para volver a la colección completa.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
