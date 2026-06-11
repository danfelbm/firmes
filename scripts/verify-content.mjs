// Verifica el contenido sembrado en Supabase, los JSON locales, el audio
// público y que RLS bloquee escrituras con la anon key.
// Uso: node scripts/verify-content.mjs
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { adminClient, anonClient, ROOT } from "./lib/env.mjs";

const supabase = adminClient();

const results = [];

function report(ok, label, detail = "") {
  results.push({ ok, label, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

function readJson(name) {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, "data", name), "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function count(table, filters = {}) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [col, val] of Object.entries(filters)) query = query.eq(col, val);
  const { count: n, error } = await query;
  if (error) throw new Error(`count ${table}: ${error.message}`);
  return n ?? 0;
}

async function verifyCounts() {
  try {
    const fichas = await count("fichas");
    report(fichas === 31, "fichas == 31", `actual: ${fichas}`);

    const noticias = await count("noticias");
    report(noticias === 72, "noticias == 72", `actual: ${noticias}`);

    const xlsx = await count("enlaces", { fuente: "archivo-xlsx" });
    report(xlsx >= 120, "enlaces fuente=archivo-xlsx >= 120", `actual: ${xlsx}`);

    const salud = await count("enlaces", { fuente: "dossier-salud" });
    report(salud >= 5, "enlaces fuente=dossier-salud >= 5", `actual: ${salud}`);
  } catch (err) {
    report(false, "conteos de tablas", err.message);
  }
}

function verifyLocalJson() {
  const expediente = readJson("expediente-ddhh.json");
  if (expediente === null) {
    console.log("SKIP  data/expediente-ddhh.json no existe aún");
  } else {
    const secciones = Array.isArray(expediente)
      ? expediente.length
      : (expediente.secciones?.length ?? 0);
    report(secciones === 7, "expediente-ddhh.json tiene 7 secciones", `actual: ${secciones}`);
  }

  const victimas = readJson("victimas.json");
  if (victimas === null) {
    console.log("SKIP  data/victimas.json no existe aún");
  } else {
    const bloques = Array.isArray(victimas)
      ? victimas.length
      : (victimas.bloques?.length ?? 0);
    report(bloques >= 7, "victimas.json >= 7 bloques", `actual: ${bloques}`);
  }
}

async function verifyAudio() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/calle-v3-mezcla.mp3`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    report(res.status === 200, "audio público responde 200", `status: ${res.status}`);
  } catch (err) {
    report(false, "audio público responde 200", err.message);
  }
}

async function verifyRls() {
  const anon = anonClient();
  const { error } = await anon.from("fichas").insert({
    orden: 32767,
    slug: "__rls-test__",
    sector: "test",
    pregunta: "test",
    lo_que_dice: "test",
    traduccion: "test",
    impacto: "test",
  });
  if (error) {
    report(true, "RLS bloquea INSERT con anon key", error.message);
  } else {
    report(false, "RLS bloquea INSERT con anon key", "el insert NO falló (riesgo de seguridad)");
    // Limpieza por si llegó a insertarse
    await supabase.from("fichas").delete().eq("slug", "__rls-test__");
  }
}

async function main() {
  await verifyCounts();
  verifyLocalJson();
  await verifyAudio();
  await verifyRls();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[verify] ${results.length - failed.length}/${results.length} checks OK`);
  if (failed.length > 0) {
    console.log("[verify] Fallaron:");
    for (const f of failed) console.log(`  - ${f.label} (${f.detail})`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
