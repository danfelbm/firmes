import Link from "next/link";

type ArchivoFiltersProps = {
  temas: { tema: string; count: number }[];
  /** Tema activo (de ?tema=). Undefined = "Todos". */
  activo?: string;
};

/**
 * Chips de filtro por tema para /centro-de-documentacion. Server component:
 * cada chip es un Link normal a ?tema=X (o a la ruta base para "Todos"), sin
 * JS de cliente.
 */
export default function ArchivoFilters({ temas, activo }: ArchivoFiltersProps) {
  const total = temas.reduce((sum, t) => sum + t.count, 0);

  const base =
    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors";
  const inactiveClass = `${base} border-white/15 bg-navy-2/80 text-white/85 hover:border-yellow/50 hover:text-yellow`;
  const activeClass = `${base} border-yellow bg-yellow text-ink`;

  return (
    <nav aria-label="Filtrar por tema" className="flex flex-wrap gap-3">
      <Link
        href="/centro-de-documentacion"
        className={activo ? inactiveClass : activeClass}
        aria-current={activo ? undefined : "true"}
      >
        Todos ({total})
      </Link>
      {temas.map(({ tema, count }) => (
        <Link
          key={tema}
          href={`/centro-de-documentacion?tema=${encodeURIComponent(tema)}`}
          className={activo === tema ? activeClass : inactiveClass}
          aria-current={activo === tema ? "true" : undefined}
        >
          {tema} ({count})
        </Link>
      ))}
    </nav>
  );
}
