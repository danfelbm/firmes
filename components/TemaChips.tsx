import Link from "next/link";

type TemaChipsProps = {
  temas: { tema: string; count: number }[];
  total: number;
  /** Tema activo (de ?tema=). Undefined = "Todos". */
  activo?: string;
  /** Otros filtros que se conservan al cambiar de tema (q, tipo, anio). */
  conservar: Record<string, string | undefined>;
};

/**
 * Chips de filtro por tema para /centro-de-documentacion. A diferencia del
 * antiguo índice de anclas, cada chip FILTRA (navega a ?tema=…), preservando
 * la búsqueda y los demás filtros activos. "Todos" limpia solo el tema.
 */
export default function TemaChips({
  temas,
  total,
  activo,
  conservar,
}: TemaChipsProps) {
  const href = (tema?: string) => {
    const params = new URLSearchParams();
    for (const [clave, valor] of Object.entries(conservar)) {
      if (valor) params.set(clave, valor);
    }
    if (tema) params.set("tema", tema);
    const qs = params.toString();
    return qs ? `/centro-de-documentacion?${qs}` : "/centro-de-documentacion";
  };

  const base =
    "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors";
  const inactivo = `${base} border-ink/15 bg-paper text-ink hover:border-yellow`;
  const activoClass = `${base} border-yellow bg-yellow text-ink`;

  return (
    <nav aria-label="Filtrar por tema" className="flex flex-wrap gap-2">
      <Link
        href={href()}
        className={activo ? inactivo : activoClass}
        aria-current={activo ? undefined : "true"}
      >
        Todos <span className={activo ? "text-muted" : undefined}>({total})</span>
      </Link>
      {temas.map(({ tema, count }) => {
        const esActivo = activo === tema;
        return (
          <Link
            key={tema}
            href={href(tema)}
            className={esActivo ? activoClass : inactivo}
            aria-current={esActivo ? "true" : undefined}
          >
            {tema}{" "}
            <span className={esActivo ? undefined : "text-muted"}>
              ({count})
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
