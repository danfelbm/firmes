"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import type { Categoria } from "@/lib/enlaces";

type FuentesFiltersProps = {
  tipos: Categoria[];
  anios: number[];
};

const selectClass =
  "rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm font-medium text-ink outline-none transition-colors hover:border-ink/30 focus:border-yellow";

/**
 * Filtros del Centro de Documentación: buscador + selects (tema, tipo, año).
 * Mismo patrón que NewsFilters: navega por searchParams con router.replace.
 */
export default function FuentesFilters({ tipos, anios }: FuentesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const tipo = searchParams.get("tipo") ?? "";
  const anio = searchParams.get("anio") ?? "";

  // El tema se controla con los chips, pero su presencia cuenta como filtro
  // activo para mostrar el botón "Limpiar".
  const hayFiltrosActivos = Boolean(
    searchParams.get("q") || searchParams.get("tema") || tipo || anio,
  );

  /** Aplica cambios sobre los filtros actuales y resetea la paginación. */
  function aplicar(cambios: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor) params.set(clave, valor);
      else params.delete(clave);
    }
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `/centro-de-documentacion?${qs}` : "/centro-de-documentacion");
  }

  function limpiar() {
    setQ("");
    router.replace("/centro-de-documentacion");
  }

  return (
    <div className="card-shadow rounded-xl border border-ink/10 bg-paper p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            aplicar({ q: q.trim() });
          }}
          className="flex flex-1 items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en títulos, notas y temas…"
              aria-label="Buscar fuentes"
              className="w-full rounded-lg border border-ink/15 bg-paper py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors hover:border-ink/30 focus:border-yellow"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-yellow px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:brightness-105"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={tipo}
            onChange={(e) => aplicar({ tipo: e.target.value })}
            aria-label="Filtrar por tipo de recurso"
            className={selectClass}
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={anio}
            onChange={(e) => aplicar({ anio: e.target.value })}
            aria-label="Filtrar por año"
            className={selectClass}
          >
            <option value="">Todos los años</option>
            {anios.map((a) => (
              <option key={a} value={String(a)}>
                {a}
              </option>
            ))}
          </select>

          {hayFiltrosActivos ? (
            <button
              type="button"
              onClick={limpiar}
              className="rounded-lg border border-ink/20 px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink/50 hover:bg-ink/5"
            >
              Limpiar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
