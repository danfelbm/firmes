// Extrae "Insumos relacionados a la salud y el sistema de salud en Colombia.docx" a data/salud.json
import mammoth from "mammoth";
import { writeFileSync } from "node:fs";

const SOURCE = "/Users/testuser/Desktop/Insumos relacionados a la salud y el sistema de salud en Colombia.docx";
const OUTPUT = new URL("../data/salud.json", import.meta.url).pathname;

const MEDIOS = [
  [/lasillavacia\.com/, "La Silla Vacía"],
  [/infobae\.com/, "Infobae"],
  [/youtube\.com|youtu\.be/, "YouTube"],
  [/eltiempo\.com/, "El Tiempo"],
  [/corrupcionaldia\.com/, "Corrupción al Día"],
  [/elespectador\.com/, "El Espectador"],
  [/semana\.com/, "Semana"],
  [/cambiocolombia\.com/, "Cambio"],
  [/tiktok\.com/, "TikTok"],
  [/facebook\.com/, "Facebook"],
  [/instagram\.com/, "Instagram"],
  [/x\.com|twitter\.com/, "X"],
];
function medioFor(url) {
  for (const [re, medio] of MEDIOS) if (re.test(url)) return medio;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const { value: rawText } = await mammoth.extractRawText({ path: SOURCE });
const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

const items = [];
let buffer = [];
for (const line of lines) {
  // Saltar encabezados generales
  if (/^Insumos relacionados a la salud/i.test(line)) continue;
  if (/^Contra-?campaña:?$/i.test(line)) continue;

  const urlMatch = line.match(/https?:\/\/\S+/);
  if (urlMatch) {
    const url = urlMatch[0].trim();
    // Texto restante en la línea de la URL (p. ej. "- El Fondo Adaptación…") → comentario
    const resto = line.replace(urlMatch[0], "").replace(/^\s*[-–—]\s*/, "").trim();

    // El buffer acumulado es el titular; si contiene 🡪, lo que sigue es comentario editorial
    const texto = buffer.join("\n").trim();
    buffer = [];
    let titulo = texto;
    let comentario = null;
    const arrowIdx = texto.indexOf("🡪");
    if (arrowIdx !== -1) {
      titulo = texto.slice(0, arrowIdx).trim();
      comentario = texto.slice(arrowIdx + "🡪".length).trim().replace(/\s*🡪\s*/g, " 🡪 ");
    }
    if (resto) comentario = comentario ? `${comentario}\n${resto}` : resto;

    items.push({ titulo, comentario, url, medio: medioFor(url) });
  } else {
    buffer.push(line);
  }
}

const result = { items };

// ===== ASSERTS =====
let ok = true;
const fail = (msg) => { console.error("ASSERT FAILED:", msg); ok = false; };

if (items.length < 5) fail(`items: ${items.length} < 5`);
items.forEach((it, i) => {
  if (!it.url || !/https?:\/\//.test(it.url)) fail(`item ${i}: URL inválida`);
  if (!it.titulo) fail(`item ${i}: sin título`);
  if (!it.medio) fail(`item ${i}: sin medio`);
});

if (!ok) process.exit(1);
writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(`OK: ${items.length} items → data/salud.json`);
items.forEach((it, i) => console.log(` ${i + 1}. [${it.medio}] ${it.titulo.slice(0, 70)}${it.comentario ? " (con comentario)" : ""}`));
