"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type NewsFiltersProps = {
  medios: string[];
  temas: string[];
  anios: number[];
};

const selectClass =
  "rounded-lg border border-white/10 bg-navy-2 px-3 py-2.5 text-sm font-medium text-white outline-none transition-colors hover:border-white/25 focus:border-yellow/60";

export default function NewsFilters({ medios, temas, anios }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const medio = searchParams.get("medio") ?? "";
  const tema = searchParams.get("tema") ?? "";
  const anio = searchParams.get("anio") ?? "";

  const hayFiltrosActivos = Boolean(
    searchParams.get("q") || medio || tema || anio,
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
    router.replace(qs ? `/hemeroteca?${qs}` : "/hemeroteca");
  }

  function limpiar() {
    setQ("");
    router.replace("/hemeroteca");
  }

  return (
    <div className="rounded-xl border border-white/10 bg-navy-2/60 p-4 md:p-5">
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
              placeholder="Buscar en titulares y resúmenes…"
              aria-label="Buscar noticias"
              className="w-full rounded-lg border border-white/10 bg-navy-2 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-muted/70 outline-none transition-colors hover:border-white/25 focus:border-yellow/60"
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
            value={medio}
            onChange={(e) => aplicar({ medio: e.target.value })}
            aria-label="Filtrar por medio"
            className={selectClass}
          >
            <option value="">Todos los medios</option>
            {medios.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={tema}
            onChange={(e) => aplicar({ tema: e.target.value })}
            aria-label="Filtrar por tema"
            className={selectClass}
          >
            <option value="">Todos los temas</option>
            {temas.map((t) => (
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
              className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-white/50 hover:bg-white/10"
            >
              Limpiar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
