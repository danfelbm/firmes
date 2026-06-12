export type FilaPropuesta = {
  propuesta: string;
  riesgo: string;
  comentario?: string | null;
};

type PropuestasRiesgosTableProps = {
  filas: FilaPropuesta[];
};

export default function PropuestasRiesgosTable({
  filas,
}: PropuestasRiesgosTableProps) {
  const hayComentarios = filas.some((fila) => fila.comentario);

  return (
    <div>
      {/* Desktop: tabla */}
      <table className="hidden w-full border-collapse overflow-hidden rounded-xl text-left md:table">
        <thead>
          <tr className="bg-yellow text-ink">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
              Propuesta
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
              Objeciones
            </th>
            {hayComentarios ? (
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
                Comentarios
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr
              key={fila.propuesta}
              className={`border-t border-ink/10 align-top ${
                i % 2 === 0 ? "bg-paper" : "bg-cream-2"
              }`}
            >
              <td className="px-6 py-5 text-sm leading-relaxed text-ink/90">
                {fila.propuesta}
              </td>
              <td className="px-6 py-5 text-sm leading-relaxed text-muted">
                {fila.riesgo}
              </td>
              {hayComentarios ? (
                <td className="px-6 py-5 text-sm leading-relaxed text-muted">
                  {fila.comentario ?? "—"}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Móvil: cards apiladas */}
      <div className="space-y-6 md:hidden">
        {filas.map((fila) => (
          <article
            key={fila.propuesta}
            className="card-shadow rounded-xl border border-ink/10 bg-paper p-6"
          >
            <p className="inline-block bg-yellow px-1.5 py-0.5 text-xs font-bold uppercase tracking-widest text-ink">
              Propuesta
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              {fila.propuesta}
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue">
              Objeciones
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {fila.riesgo}
            </p>
            {fila.comentario ? (
              <>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-red">
                  Comentarios
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {fila.comentario}
                </p>
              </>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
