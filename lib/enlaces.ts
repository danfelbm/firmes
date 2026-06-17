import {
  FileText,
  Newspaper,
  Play,
  Share2,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

import type { Enlace } from "./queries";

/**
 * Capa de PRESENTACIÓN para los enlaces del archivo. El campo `tipo` de la
 * tabla `enlaces` es texto libre y muy ruidoso (~80 variantes: desde "Video"
 * hasta párrafos completos de análisis en las filas de discursos), así que
 * NO se puede filtrar/agrupar por él tal cual. Aquí derivamos una categoría
 * normalizada a partir del dominio de la URL (señal más fiable) y, en su
 * defecto, de palabras clave del `tipo`. Nada de esto altera `data/*.json`.
 */

export const CATEGORIAS = [
  "Video",
  "Redes sociales",
  "Prensa",
  "Documento",
  "Nota",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/**
 * Mapa categoría → icono. Se exporta como objeto constante (no como función)
 * para que el lint `react-hooks/static-components` permita indexarlo en el
 * render: `const Icon = ICONOS_POR_CATEGORIA[categoria]`.
 */
export const ICONOS_POR_CATEGORIA: Record<Categoria, LucideIcon> = {
  Video: Play,
  "Redes sociales": Share2,
  Prensa: Newspaper,
  Documento: FileText,
  Nota: StickyNote,
};

export function dominioDe(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Minúsculas + sin tildes, para comparaciones tolerantes a acentos. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Categoría normalizada de un enlace. Prioridad: sin URL → "Nota"; luego el
 * dominio; luego palabras clave del `tipo`; fallback "Prensa".
 */
export function categoriaDeRecurso(enlace: Enlace): Categoria {
  if (!enlace.url) return "Nota";

  const dominio = dominioDe(enlace.url) ?? "";
  if (/(youtube|youtu\.be|tiktok)/.test(dominio)) return "Video";
  if (/(twitter|x\.com|facebook|fb\.watch|instagram)/.test(dominio)) {
    return "Redes sociales";
  }

  const tipo = normalizar(enlace.tipo ?? "");
  if (/(video|vimeo|youtube)/.test(tipo)) return "Video";
  if (/(tiktok|instagram|facebook|red social|red x|twitter)/.test(tipo)) {
    return "Redes sociales";
  }
  if (tipo === "x" || /\bred x\b/.test(tipo)) return "Redes sociales";
  if (/(columna|documento|programa de gobierno|discurso)/.test(tipo)) {
    return "Documento";
  }

  return "Prensa";
}

/** Año (de `fecha`) de un enlace, o null si no tiene fecha válida. */
export function anioDe(enlace: Enlace): number | null {
  if (!enlace.fecha) return null;
  const anio = Number(enlace.fecha.slice(0, 4));
  return Number.isFinite(anio) && anio > 0 ? anio : null;
}

/**
 * ¿El enlace coincide con la búsqueda libre `q`? Busca en título,
 * observación, tema y dominio, ignorando tildes y mayúsculas.
 */
export function coincideBusqueda(enlace: Enlace, q: string): boolean {
  const termino = normalizar(q).trim();
  if (!termino) return true;
  const heno = normalizar(
    [
      enlace.titulo,
      enlace.observacion ?? "",
      enlace.tema,
      dominioDe(enlace.url) ?? "",
    ].join(" "),
  );
  return termino.split(/\s+/).every((palabra) => heno.includes(palabra));
}
