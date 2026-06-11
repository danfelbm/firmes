import Link from "next/link";

type PaginationProps = {
  total: number;
  page: number;
  perPage: number;
  baseHref: string;
  /** Filtros activos a conservar en los links (sin `page`). */
  searchParams?: Record<string, string | undefined>;
};

export default function Pagination({
  total,
  page,
  perPage,
  baseHref,
  searchParams = {},
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  };

  const paginas = Array.from({ length: totalPages }, (_, i) => i + 1);
  const baseItem =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-bold transition-colors";

  return (
    <nav
      aria-label="Paginación de la hemeroteca"
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label="Página anterior"
          className={`${baseItem} border border-white/10 text-muted hover:border-white/30 hover:text-white`}
        >
          «
        </Link>
      ) : (
        <span aria-hidden="true" className={`${baseItem} text-white/25`}>
          «
        </span>
      )}

      {paginas.map((p) =>
        p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${baseItem} bg-yellow text-ink`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className={`${baseItem} border border-white/10 text-muted hover:border-white/30 hover:text-white`}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label="Página siguiente"
          className={`${baseItem} border border-white/10 text-muted hover:border-white/30 hover:text-white`}
        >
          »
        </Link>
      ) : (
        <span aria-hidden="true" className={`${baseItem} text-white/25`}>
          »
        </span>
      )}
    </nav>
  );
}
