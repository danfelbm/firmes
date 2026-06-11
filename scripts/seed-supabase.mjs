// Siembra las tablas de Supabase desde los JSON de data/.
// Uso: node scripts/seed-supabase.mjs
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { adminClient, ROOT } from "./lib/env.mjs";

const supabase = adminClient();
const BATCH = 100;

function readJson(name) {
  const path = resolve(ROOT, "data", name);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`[seed] AVISO: falta data/${name} — se omite.`);
      return null;
    }
    throw new Error(`[seed] data/${name} inválido: ${err.message}`);
  }
}

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function upsertBatches(table, rows, onConflict) {
  for (const batch of chunks(rows, BATCH)) {
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) throw new Error(`[seed] upsert ${table}: ${error.message}`);
  }
}

async function insertBatches(table, rows) {
  for (const batch of chunks(rows, BATCH)) {
    const { error } = await supabase.from(table).insert(batch);
    if (error) throw new Error(`[seed] insert ${table}: ${error.message}`);
  }
}

async function count(table, filters = {}) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [col, val] of Object.entries(filters)) query = query.eq(col, val);
  const { count: n, error } = await query;
  if (error) throw new Error(`[seed] count ${table}: ${error.message}`);
  return n ?? 0;
}

async function seedFichas() {
  const fichas = readJson("contracaja.json");
  if (!fichas) return;
  const rows = fichas.map((f) => ({
    orden: f.orden,
    slug: f.slug,
    sector: f.sector,
    pregunta: f.pregunta,
    lo_que_dice: f.lo_que_dice,
    traduccion: f.traduccion,
    impacto: f.impacto,
    fuentes: f.fuentes ?? [],
    icono: f.icono ?? "shield",
  }));
  await upsertBatches("fichas", rows, "orden");
  console.log(`[seed] fichas: upsert de ${rows.length} filas`);
}

async function seedNoticias() {
  const noticias = readJson("noticias.json");
  if (!noticias) return;
  const rows = noticias.map((n) => ({
    slug: n.slug,
    titular: n.titular,
    resumen: n.resumen ?? "",
    fecha: n.fecha ?? null,
    periodista: n.periodista ?? null,
    medio: n.medio ?? null,
    region: n.region ?? null,
    tema: n.tema ?? null,
    link: n.link,
  }));
  await upsertBatches("noticias", rows, "slug");
  console.log(`[seed] noticias: upsert de ${rows.length} filas`);
}

async function replaceEnlaces(fuente, rows) {
  const { error: delError } = await supabase
    .from("enlaces")
    .delete()
    .eq("fuente", fuente);
  if (delError) {
    throw new Error(`[seed] delete enlaces (${fuente}): ${delError.message}`);
  }
  await insertBatches("enlaces", rows);
  console.log(`[seed] enlaces (${fuente}): ${rows.length} filas insertadas`);
}

async function seedEnlaces() {
  const enlaces = readJson("enlaces.json");
  if (enlaces) {
    const rows = enlaces.map((e, i) => ({
      tema: e.tema,
      fecha: e.fecha ?? null,
      titulo: e.titulo,
      url: e.url,
      tipo: e.tipo ?? null,
      observacion: e.observacion ?? null,
      fuente: "archivo-xlsx",
      orden: e.orden ?? i,
    }));
    await replaceEnlaces("archivo-xlsx", rows);
  }

  const salud = readJson("salud.json");
  if (salud) {
    const items = Array.isArray(salud) ? salud : (salud.items ?? salud.enlaces ?? []);
    const rows = items.map((e, i) => ({
      tema: "Salud",
      fecha: e.fecha ?? null,
      titulo: e.titulo ?? e.title ?? "",
      url: e.url ?? e.link ?? "",
      tipo: e.tipo ?? null,
      observacion: e.comentario ?? e.observacion ?? null,
      fuente: "dossier-salud",
      orden: e.orden ?? i,
    }));
    await replaceEnlaces("dossier-salud", rows);
  }
}

async function main() {
  await seedFichas();
  await seedNoticias();
  await seedEnlaces();

  console.log("[seed] Conteos finales:");
  console.log(`  fichas: ${await count("fichas")}`);
  console.log(`  noticias: ${await count("noticias")}`);
  console.log(`  enlaces (archivo-xlsx): ${await count("enlaces", { fuente: "archivo-xlsx" })}`);
  console.log(`  enlaces (dossier-salud): ${await count("enlaces", { fuente: "dossier-salud" })}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
