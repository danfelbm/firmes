import type { Metadata } from "next";

import ArchivoFilters from "@/components/ArchivoFilters";
import Badge from "@/components/Badge";
import EnlaceCard from "@/components/EnlaceCard";
import Reveal from "@/components/Reveal";
import { getEnlaces, getTemasEnlaces, type Enlace } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Centro de Documentación de la Patria",
  description:
    "Todo lo que se ha dicho y publicado sobre el Tigre y su equipo: videos, notas de prensa y documentos organizados por tema para su consulta. Aquí no se esconde nada.",
};

type CentroDeDocumentacionPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CentroDeDocumentacionPage({
  searchParams,
}: CentroDeDocumentacionPageProps) {
  const params = await searchParams;
  const temaParam = Array.isArray(params.tema) ? params.tema[0] : params.tema;

  const temas = await getTemasEnlaces();
  // Solo filtramos por temas que existen; un ?tema= inválido cae a "Todos".
  const temaActivo = temas.some((t) => t.tema === temaParam)
    ? temaParam
    : undefined;

  const enlaces = await getEnlaces(temaActivo);
  const total = temas.reduce((sum, t) => sum + t.count, 0);

  // Sin filtro: agrupamos por tema en el mismo orden de los chips (conteo desc).
  const grupos: { tema: string; enlaces: Enlace[] }[] = temaActivo
    ? []
    : temas.map(({ tema }) => ({
        tema,
        enlaces: enlaces.filter((e) => e.tema === tema),
      }));

  return (
    <main>
      {/* Encabezado */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Badge>{`${total} fuentes · Transparencia total`}</Badge>
            <h1 className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-white">
              Centro de <span className="text-yellow">Documentación</span> de
              la Patria
            </h1>
            <span
              className="mt-5 block h-1 w-14 rounded-full bg-yellow"
              aria-hidden="true"
            />
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
              Todo lo que se ha dicho y publicado sobre el Tigre y su equipo,
              organizado por tema para su consulta. Aquí no se esconde nada.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10">
              <ArchivoFilters temas={temas} activo={temaActivo} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Listado */}
      <section className="bg-navy-2 section-padding">
        <div className="mx-auto max-w-5xl px-6">
          {temaActivo ? (
            <div className="flex flex-col gap-4">
              {enlaces.map((enlace) => (
                <EnlaceCard key={enlace.id} enlace={enlace} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {grupos.map(({ tema, enlaces: enlacesTema }) => (
                <div key={tema}>
                  <h2 className="yellow-tick text-2xl font-extrabold text-white">
                    {tema}{" "}
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
          )}
        </div>
      </section>
    </main>
  );
}
