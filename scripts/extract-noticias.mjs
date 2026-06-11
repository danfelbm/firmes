// Extrae "Noticias Abelardo - Hoja 1.csv" a data/noticias.json
import { parse } from "csv-parse/sync";
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = "/Users/testuser/Desktop/Noticias Abelardo - Hoja 1.csv";
const OUTPUT = new URL("../data/noticias.json", import.meta.url).pathname;

function slugify(str, maxLen = 80) {
  let s = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (s.length > maxLen) {
    s = s.slice(0, maxLen);
    // no cortar a mitad de palabra: recortar al último guion
    const cut = s.lastIndexOf("-");
    if (cut > 40) s = s.slice(0, cut);
  }
  return s;
}

function parseFecha(raw, rowIdx) {
  if (!raw || !raw.trim()) {
    console.warn(`AVISO fila ${rowIdx}: fecha vacía → null`);
    return null;
  }
  // Normalización leniente: espacios internos y dobles barras ("23/ 05/2026", "12/02//2026")
  const cleaned = raw.trim().replace(/\s+/g, "").replace(/\/{2,}/g, "/");
  if (cleaned !== raw.trim()) console.warn(`AVISO fila ${rowIdx}: fecha normalizada "${raw}" → "${cleaned}"`);
  const m = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) {
    console.warn(`AVISO fila ${rowIdx}: fecha ilegible "${raw}" → null`);
    return null;
  }
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

const csv = readFileSync(SOURCE, "utf8");
const rows = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  bom: true,
  trim: true,
});

const nul = (v) => (v != null && String(v).trim() ? String(v).trim() : null);

const seen = new Map();
const noticias = rows.map((r, i) => {
  const titular = nul(r["Titular noticia"]);
  let slug = slugify(titular || `noticia-${i + 1}`);
  if (seen.has(slug)) {
    const n = seen.get(slug) + 1;
    seen.set(slug, n);
    slug = `${slug}-${n}`;
  } else {
    seen.set(slug, 1);
  }
  return {
    slug,
    titular,
    resumen: nul(r["Resumen 100 palabras"]),
    fecha: parseFecha(r["Fecha"], i + 1),
    periodista: nul(r["Periodista / Columnista"]),
    medio: nul(r["Medio"]),
    region: nul(r["Región"]),
    tema: nul(r["Tema"]),
    link: nul(r["Link"]),
  };
});

// ===== ASSERTS =====
let ok = true;
const fail = (msg) => { console.error("ASSERT FAILED:", msg); ok = false; };

// NOTA: la fuente tiene 72 líneas físicas pero 52 registros reales (varios campos
// citados son multilínea). Se valida contra el conteo real de registros.
if (noticias.length !== 52) fail(`se esperaban 52 registros reales, hay ${noticias.length}`);
noticias.forEach((n, i) => {
  if (!n.titular) fail(`fila ${i + 1}: titular vacío`);
  if (!n.resumen) console.warn(`AVISO fila ${i + 1}: resumen vacío en la fuente → null ("${n.titular.slice(0, 60)}")`);
  if (!n.link || !/https?:\/\//.test(n.link)) fail(`fila ${i + 1}: link vacío o inválido`);
});
const slugSet = new Set(noticias.map((n) => n.slug));
if (slugSet.size !== noticias.length) fail("slugs duplicados");

if (!ok) process.exit(1);

writeFileSync(OUTPUT, JSON.stringify(noticias, null, 2) + "\n", "utf8");
console.log(`OK: ${noticias.length} noticias escritas en data/noticias.json`);
console.log("Con fecha:", noticias.filter((n) => n.fecha).length, "| sin fecha:", noticias.filter((n) => !n.fecha).length);
console.log("Medios distintos:", new Set(noticias.map((n) => n.medio).filter(Boolean)).size);
