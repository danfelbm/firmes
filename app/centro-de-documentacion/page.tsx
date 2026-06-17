import type { Metadata } from "next";
import Link from "next/link";

import Badge from "@/components/Badge";
import EnlaceCard from "@/components/EnlaceCard";
import FuentesFilters from "@/components/FuentesFilters";
import Pagination from "@/components/Pagination";
import Reveal from "@/components/Reveal";
import {
  anioDe,
  categoriaDeRecurso,
  CATEGORIAS,
  coincideBusqueda,
  ICONOS_POR_CATEGORIA,
  normalizar,
  type Categoria,
} from "@/lib/enlaces";
import { getEnlaces, getTemasEnlaces, type Enlace } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Centro de Documentación de la Patria",
  description:
    "Archivo abierto de fuentes sobre el Tigre y su equipo: videos, columnas, notas de prensa y declaraciones, con buscador y filtros por tema. Aquí no se esconde nada.",
};

const PER_PAGE = 20;

type CentroDeDocumentacionPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** id de ancla a partir de un tema (para el índice de saltos). */
function anclaDeTema(tema: string): string {
  return `tema-${normalizar(tema).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/** Orden por fecha descendente, con los sin fecha al final. */
function porFechaDesc(a: Enlace, b: Enlace): number {
  if (a.fecha === b.fecha) return 0;
  if (!a.fecha) return 1;
  if (!b.fecha) return -1;
  return a.fecha < b.fecha ? 1 : -1;
}

export default async function CentroDeDocumentacionPage({
  searchParams,
}: CentroDeDocumentacionPageProps) {
  const params = await searchParams;
  const valor = (clave: string) =>
    Array.isArray(params[clave]) ? params[clave][0] : params[clave];

  const q = (valor("q") ?? "").trim();
  const temaParam = valor("tema");
  const tipoParam = valor("tipo");
  const anioParam = valor("anio");
  const pageParam = Number(valor("page")) || 1;

  const [todos, temasConteo] = await Promise.all([
    getEnlaces(),
    getTemasEnlaces(),
  ]);
  const enlaces = todos.filter((e) => e.url);
  const notas = todos.filter((e) => !e.url);
  const total = todos.length;

  // Facetas para los selects.
  const temas = temasConteo.map((t) => t.tema); // ya ordenados por conteo desc
  const tiposPresentes = CATEGORIAS.filter(
    (c) => c !== "Nota" && enlaces.some((e) => categoriaDeRecurso(e) === c),
  );
  const anios = [
    ...new Set(
      enlaces
        .map(anioDe)
        .filter((a): a is number => a !== null),
    ),
  ].sort((a, b) => b - a);

  // Validación de parámetros: un valor inexistente cae a "sin filtro".
  const tema = temaParam && temas.includes(temaParam) ? temaParam : undefined;
  const tipo: Categoria | undefined =
    tipoParam && (tiposPresentes as string[]).includes(tipoParam)
      ? (tipoParam as Categoria)
      : undefined;
  const anioNum = Number(anioParam);
  const anio = anios.includes(anioNum) ? anioNum : undefined;

  const hayFiltros = Boolean(q || tema || tipo || anio);

  // Vista filtrada: lista plana de enlaces con URL.
  const filtrados = enlaces
    .filter((e) => !tema || e.tema === tema)
    .filter((e) => !tipo || categoriaDeRecurso(e) === tipo)
    .filter((e) => !anio || anioDe(e) === anio)
    .filter((e) => coincideBusqueda(e, q))
    .sort(porFechaDesc);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const page = Math.min(Math.max(1, pageParam), totalPaginas);
  const paginaEnlaces = filtrados.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Notas: solo tienen sentido cuando no se filtra por tipo ni por año.
  const mostrarNotas = !tipo && !anio;
  const notasFiltradas = mostrarNotas
    ? notas
        .filter((n) => !tema || n.tema === tema)
        .filter((n) => coincideBusqueda(n, q))
    : [];

  // Vista por defecto: agrupación por tema (descubrimiento).
  const grupos = hayFiltros
    ? []
    : temasConteo.map(({ tema: t }) => ({
        tema: t,
        enlaces: enlaces.filter((e) => e.tema === t),
      }));

  const leyenda = [
    ...tiposPresentes,
    ...(notas.length ? (["Nota"] as Categoria[]) : []),
  ];

  const filtrosActivos = {
    q: q || undefined,
    tema,
    tipo,
    anio: anio ? String(anio) : undefined,
  };

  return (
    <main>
      {/* Encabezado */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>{`${total} fuentes · Transparencia total`}</Badge>
            <h1 className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-ink">
              Centro de <span className="bg-yellow px-2">Documentación</span>{" "}
              de la Patria
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              Con orgullo y transparencia total reunimos aquí cada video,
              columna, nota de prensa y declaración del Tigre y su equipo.{" "}
              <strong className="font-semibold text-ink">
                Busque, filtre por tema o tipo y verifique usted mismo:
              </strong>{" "}
              no escondemos ni una sola fuente.
            </p>

            {/* Leyenda de tipos */}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {leyenda.map((categoria) => {
                const Icon = ICONOS_POR_CATEGORIA[categoria];
                return (
                  <li
                    key={categoria}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted"
                  >
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-ink/5 text-ink">
                      <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    {categoria}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10">
              <FuentesFilters
                temas={temas}
                tipos={tiposPresentes}
                anios={anios}
              />
            </div>
          </Reveal>

          {/* Índice de temas (solo en la vista por defecto) */}
          {!hayFiltros ? (
            <Reveal delay={150}>
              <nav
                aria-label="Saltar a un tema"
                className="mt-6 flex flex-wrap gap-2"
              >
                {temasConteo.map(({ tema: t, count }) => (
                  <a
                    key={t}
                    href={`#${anclaDeTema(t)}`}
                    className="rounded-full border border-ink/15 bg-paper px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-yellow"
                  >
                    {t} <span className="text-muted">({count})</span>
                  </a>
                ))}
              </nav>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* Listado */}
      <section className="bg-paper section-padding">
        <div className="mx-auto max-w-5xl px-6">
          {hayFiltros ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                {filtrados.length}{" "}
                {filtrados.length === 1
                  ? "fuente encontrada"
                  : "fuentes encontradas"}
                {notasFiltradas.length
                  ? ` · ${notasFiltradas.length} ${
                      notasFiltradas.length === 1 ? "nota" : "notas"
                    }`
                  : ""}
              </p>

              {filtrados.length || notasFiltradas.length ? (
                <>
                  {paginaEnlaces.length ? (
                    <div className="mt-6 flex flex-col gap-4">
                      {paginaEnlaces.map((enlace) => (
                        <EnlaceCard key={enlace.id} enlace={enlace} />
                      ))}
                    </div>
                  ) : null}

                  <Pagination
                    total={filtrados.length}
                    page={page}
                    perPage={PER_PAGE}
                    baseHref="/centro-de-documentacion"
                    searchParams={filtrosActivos}
                  />

                  {notasFiltradas.length ? (
                    <div className="mt-12 border-t border-ink/10 pt-10">
                      <h2 className="yellow-tick text-2xl font-extrabold text-ink">
                        Notas del archivo
                      </h2>
                      <div className="mt-6 flex flex-col gap-4">
                        {notasFiltradas.map((nota) => (
                          <EnlaceCard key={nota.id} enlace={nota} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-8 rounded-xl border border-ink/10 bg-cream p-10 text-center">
                  <p className="text-lg font-semibold text-ink">
                    El archivo no registra ninguna fuente con esos criterios.
                  </p>
                  <p className="mt-2 text-muted">
                    Pero tranquilo: aquí no se esconde nada. Pruebe con otro
                    término o quite los filtros.
                  </p>
                  <Link
                    href="/centro-de-documentacion"
                    className="mt-6 inline-block text-sm font-bold text-blue transition-colors hover:text-red"
                  >
                    Ver todas las fuentes →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col gap-16">
                {grupos.map(({ tema: t, enlaces: enlacesTema }) => (
                  <div
                    key={t}
                    id={anclaDeTema(t)}
                    className="scroll-mt-28"
                  >
                    <h2 className="yellow-tick text-2xl font-extrabold text-ink">
                      {t}{" "}
                      <span className="text-base font-semibold text-muted">
                        ({enlacesTema.length})
                      </span>
                    </h2>
                    <div className="mt-6 flex flex-col gap-4">
                      {enlacesTema.map((enlace) => (
                        <EnlaceCard key={enlace.id} enlace={enlace} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {notas.length ? (
                <div className="mt-16 border-t border-ink/10 pt-10">
                  <h2 className="yellow-tick text-2xl font-extrabold text-ink">
                    Notas del archivo{" "}
                    <span className="text-base font-semibold text-muted">
                      ({notas.length})
                    </span>
                  </h2>
                  <p className="mt-3 max-w-3xl text-muted">
                    Apuntes de contexto del archivo que no enlazan a una fuente
                    externa, conservados tal cual para que no falte nada.
                  </p>
                  <div className="mt-6 flex flex-col gap-4">
                    {notas.map((nota) => (
                      <EnlaceCard key={nota.id} enlace={nota} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
