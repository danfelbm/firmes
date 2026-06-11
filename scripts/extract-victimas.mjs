// Extrae "VICTIMAS AFECTACIONES DISCURSO ABELARDO.docx" a data/victimas.json
import mammoth from "mammoth";
import { writeFileSync } from "node:fs";

const SOURCE = "/Users/testuser/Desktop/VICTIMAS AFECTACIONES DISCURSO ABELARDO.docx";
const OUTPUT = new URL("../data/victimas.json", import.meta.url).pathname;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripTags = (html) =>
  decode(html.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "")).replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ").trim();

const { value: html } = await mammoth.convertToHtml({ path: SOURCE });

// Tokenizar elementos de primer nivel: <p>, <ul>, <table>
const tokens = [...html.matchAll(/<(p|ul|table)>([\s\S]*?)<\/\1>/g)].map((m) => ({ tag: m[1], inner: m[2] }));

const TABLE_MARKER = /^Programa de gobierno de Abelardo de la Espriella$/;

const bloques = [];
let current = null;
let tablaPropuestas = [];
let inTableSection = false;

const flush = () => {
  if (current) {
    bloques.push({
      titulo: current.titulo,
      cita: current.citas.length ? current.citas.join("\n\n") : null,
      fuenteUrl: current.urls.length ? current.urls[0] : null,
      fuentesAdicionales: current.urls.slice(1),
      anotacion: current.anotaciones.length ? current.anotaciones.join("\n\n") : null,
    });
    current = null;
  }
};

for (const tok of tokens) {
  if (tok.tag === "table") {
    const rows = [...tok.inner.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) =>
      [...m[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => stripTags(c[1].replace(/<\/p>\s*<p>/g, "\n")))
    );
    // Primera fila = encabezados; el resto son propuestas
    for (const row of rows.slice(1)) {
      const [propuesta, riesgo, comentario] = [row[0] || "", row[1] || "", row[2] || ""];
      if (!propuesta.trim()) continue;
      tablaPropuestas.push({
        propuesta: propuesta.trim(),
        riesgo: riesgo.trim() || null,
        comentario: comentario.trim() || null,
      });
    }
    continue;
  }

  if (tok.tag === "ul") {
    // Viñetas de análisis → anotación del bloque actual
    const items = [...tok.inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => stripTags(m[1])).filter(Boolean);
    if (current && items.length) current.anotaciones.push(...items);
    continue;
  }

  // <p>
  const href = tok.inner.match(/<a href="([^"]+)"/);
  const text = stripTags(tok.inner);
  if (!text && !href) continue;

  if (TABLE_MARKER.test(text)) {
    flush();
    inTableSection = true;
    continue;
  }
  if (inTableSection) continue;

  if (href) {
    if (current) current.urls.push(decode(href[1]));
    continue;
  }
  if (/^Anotaci[óo]n\s*:/i.test(text)) {
    const body = text.replace(/^Anotaci[óo]n\s*:\s*/i, "").trim();
    if (current && body) current.anotaciones.push(body);
    continue;
  }
  if (/^[“«"]/.test(text)) {
    if (current) current.citas.push(text);
    continue;
  }
  // Título de un nuevo bloque
  flush();
  current = { titulo: text, citas: [], urls: [], anotaciones: [] };
}
flush();

const result = {
  intro: null, // el documento empieza directamente con el primer bloque, sin introducción
  bloques,
  tablaPropuestas,
};

// ===== ASSERTS =====
let ok = true;
const fail = (msg) => { console.error("ASSERT FAILED:", msg); ok = false; };

if (bloques.length < 7) fail(`bloques: ${bloques.length} < 7`);
if (tablaPropuestas.length < 3) fail(`tablaPropuestas: ${tablaPropuestas.length} < 3`);
const conCita = bloques.filter((b) => b.cita && b.cita.trim());
if (conCita.length < 7) fail(`bloques con cita no vacía: ${conCita.length} < 7`);
bloques.forEach((b, i) => {
  if (!b.titulo) fail(`bloque ${i}: sin título`);
  if (!b.fuenteUrl) fail(`bloque ${i} ("${(b.titulo || "").slice(0, 50)}"): sin fuenteUrl`);
  if (!b.cita) console.warn(`AVISO: bloque ${i + 1} ("${b.titulo.slice(0, 60)}") sin cita textual en la fuente → null`);
});
tablaPropuestas.forEach((t, i) => {
  if (!t.propuesta) fail(`tabla fila ${i}: propuesta vacía`);
  if (!t.riesgo) fail(`tabla fila ${i}: riesgo vacío`);
});

if (!ok) process.exit(1);
writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(`OK: ${bloques.length} bloques, ${tablaPropuestas.length} filas de tabla → data/victimas.json`);
console.log("Bloques con cita:", conCita.length, "| con anotación:", bloques.filter((b) => b.anotacion).length);
