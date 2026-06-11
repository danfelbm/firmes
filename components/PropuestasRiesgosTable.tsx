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
              Riesgo para tus derechos
            </th>
            {hayComentarios ? (
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
                Comentario
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr
              key={fila.propuesta}
              className={`border-t border-white/10 align-top ${
                i % 2 === 0 ? "bg-navy-2" : "bg-navy-2/40"
              }`}
            >
              <td className="px-6 py-5 text-sm leading-relaxed text-white/90">
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
            className="rounded-xl border border-white/10 bg-navy-2 p-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-yellow">
              Propuesta
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              {fila.propuesta}
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue">
              Riesgo para tus derechos
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {fila.riesgo}
            </p>
            {fila.comentario ? (
              <>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-red">
                  Comentario
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
