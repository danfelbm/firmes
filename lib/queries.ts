import { createClient } from "./supabase/server";

import type { Database } from "./supabase/types";

export type Ficha = Database["public"]["Tables"]["fichas"]["Row"];
export type Noticia = Database["public"]["Tables"]["noticias"]["Row"];
export type Enlace = Database["public"]["Tables"]["enlaces"]["Row"];

/* ------------------------------- Fichas -------------------------------- */

/** Todas las fichas de la contracaja, ordenadas por `orden` ascendente. */
export async function getFichas(): Promise<Ficha[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fichas")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw new Error(`getFichas: ${error.message}`);
  return data ?? [];
}

/** Una ficha por slug, o null si no existe. */
export async function getFichaBySlug(slug: string): Promise<Ficha | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fichas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`getFichaBySlug: ${error.message}`);
  return data;
}

/** Las primeras `n` fichas por orden (para destacados en el home). */
export async function getFichasDestacadas(n: number): Promise<Ficha[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fichas")
    .select("*")
    .order("orden", { ascending: true })
    .limit(n);
  if (error) throw new Error(`getFichasDestacadas: ${error.message}`);
  return data ?? [];
}

/* ------------------------------ Noticias ------------------------------- */

export interface GetNoticiasParams {
  tema?: string;
  medio?: string;
  anio?: number;
  q?: string;
  page?: number;
  perPage?: number;
}

/** Escapa caracteres especiales de PostgREST en patrones de búsqueda. */
function sanitizeSearch(q: string): string {
  return q.replace(/[%_,()]/g, " ").trim();
}

/** Noticias con filtros, búsqueda y paginación. */
export async function getNoticias({
  tema,
  medio,
  anio,
  q,
  page = 1,
  perPage = 12,
}: GetNoticiasParams = {}): Promise<{ rows: Noticia[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("noticias")
    .select("*", { count: "exact" })
    .order("fecha", { ascending: false, nullsFirst: false });

  if (tema) query = query.eq("tema", tema);
  if (medio) query = query.eq("medio", medio);
  if (anio) {
    query = query
      .gte("fecha", `${anio}-01-01`)
      .lte("fecha", `${anio}-12-31`);
  }
  if (q) {
    const term = sanitizeSearch(q);
    if (term) {
      query = query.or(`titular.ilike.%${term}%,resumen.ilike.%${term}%`);
    }
  }

  const from = (page - 1) * perPage;
  const { data, count, error } = await query.range(from, from + perPage - 1);
  if (error) throw new Error(`getNoticias: ${error.message}`);
  return { rows: data ?? [], total: count ?? 0 };
}

/** Las `n` noticias más recientes (fecha desc, nulls al final). */
export async function getNoticiasRecientes(n: number): Promise<Noticia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .order("fecha", { ascending: false, nullsFirst: false })
    .limit(n);
  if (error) throw new Error(`getNoticiasRecientes: ${error.message}`);
  return data ?? [];
}

/** Listas únicas de medios y temas para los filtros del listado. */
export async function getMediosYTemas(): Promise<{
  medios: string[];
  temas: string[];
}> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("noticias").select("medio, tema");
  if (error) throw new Error(`getMediosYTemas: ${error.message}`);

  const medios = new Set<string>();
  const temas = new Set<string>();
  for (const row of data ?? []) {
    if (row.medio) medios.add(row.medio);
    if (row.tema) temas.add(row.tema);
  }
  const collator = new Intl.Collator("es");
  return {
    medios: [...medios].sort(collator.compare),
    temas: [...temas].sort(collator.compare),
  };
}

/* ------------------------------- Enlaces ------------------------------- */

/** Enlaces del archivo, opcionalmente filtrados por tema. */
export async function getEnlaces(tema?: string): Promise<Enlace[]> {
  const supabase = await createClient();
  let query = supabase
    .from("enlaces")
    .select("*")
    .order("orden", { ascending: true })
    .order("fecha", { ascending: false, nullsFirst: false });
  if (tema) query = query.eq("tema", tema);
  const { data, error } = await query;
  if (error) throw new Error(`getEnlaces: ${error.message}`);
  return data ?? [];
}

/** Temas únicos de enlaces con su conteo, ordenados por conteo desc. */
export async function getTemasEnlaces(): Promise<
  { tema: string; count: number }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("enlaces").select("tema");
  if (error) throw new Error(`getTemasEnlaces: ${error.message}`);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.tema, (counts.get(row.tema) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tema, count]) => ({ tema, count }))
    .sort((a, b) => b.count - a.count || a.tema.localeCompare(b.tema, "es"));
}

/** Enlaces del dossier de salud (fuente='dossier-salud'). */
export async function getEnlacesSalud(): Promise<Enlace[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enlaces")
    .select("*")
    .eq("fuente", "dossier-salud")
    .order("orden", { ascending: true });
  if (error) throw new Error(`getEnlacesSalud: ${error.message}`);
  return data ?? [];
}
