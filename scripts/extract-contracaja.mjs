// Extrae las 31 fichas sectoriales de "Contracaja ADLE.docx" a data/contracaja.json
import mammoth from "mammoth";
import { writeFileSync } from "node:fs";

const SOURCE = "/Users/testuser/Desktop/Contracaja ADLE.docx";
const OUTPUT = new URL("../data/contracaja.json", import.meta.url).pathname;

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Mapeo sector → icono lucide-react (por palabra clave en el nombre del sector)
const ICON_RULES = [
  [/adulto mayor/i, "heart-handshake"],
  [/afros?/i, "users"],
  [/cambio clim/i, "thermometer-sun"],
  [/^ambiente/i, "tree-pine"],
  [/animales/i, "paw-print"],
  [/artes/i, "palette"],
  [/campesin/i, "wheat"],
  [/ciencia/i, "flask-conical"],
  [/derechos humanos/i, "scale"],
  [/discapacidad/i, "accessibility"],
  [/drogas/i, "spray-can"],
  [/econom/i, "coins"],
  [/educaci/i, "graduation-cap"],
  [/funci.n p.blica/i, "landmark"],
  [/gesti.n del riesgo/i, "life-buoy"],
  [/ind.genas/i, "mountain"],
  [/infraestructura/i, "construction"],
  [/internacional/i, "globe"],
  [/interreligioso/i, "church"],
  [/j.venes/i, "sparkles"],
  [/lgbti/i, "rainbow"],
  [/corrupci/i, "shield-alert"],
  [/mujeres/i, "venus"],
  [/ni.ez/i, "baby"],
  [/participaci.n|reforma/i, "vote"],
  [/vivienda/i, "home"],
  [/salud/i, "heart-pulse"],
  [/seguridad/i, "shield"],
  [/transici.n energ/i, "zap"],
  [/turismo/i, "map"],
  [/v.ctimas/i, "flower-2"],
];

function iconFor(sector) {
  for (const [re, icon] of ICON_RULES) if (re.test(sector)) return icon;
  return "file-text";
}

const { value: rawText } = await mammoth.extractRawText({ path: SOURCE });
const lines = rawText.split("\n").map((l) => l.trim());

// Encontrar encabezados de ficha: "N. SECTOR EN MAYÚSCULAS"
const headerIdx = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\d{1,2})\.\s+([A-ZÁÉÍÓÚÑÜ].*)$/);
  if (m && /^[A-ZÁÉÍÓÚÑÜ0-9\s,–\-]+$/.test(m[2])) {
    headerIdx.push({ idx: i, orden: parseInt(m[1], 10), sector: m[2].trim() });
  }
}

const LABELS = [
  { key: "sector_label", re: /^SECTOR:\s*(.*)$/ },
  { key: "lo_que_dice", re: /^LO QUE DICE ABELARDO:\s*(.*)$/ },
  { key: "traduccion", re: /^TRADUCCI[ÓO]N PEDAG[ÓO]GICA\s*\(Lo que realmente propone\):\s*(.*)$/i },
  { key: "impacto", re: /^IMPACTO COTIDIANO\s*\(Framing Negativo\):\s*(.*)$/i },
  { key: "fuentes", re: /^Fuente[s]?:\s*(.*)$/ },
];

const fichas = [];
for (let f = 0; f < headerIdx.length; f++) {
  const { idx, orden, sector } = headerIdx[f];
  const end = f + 1 < headerIdx.length ? headerIdx[f + 1].idx : lines.length;
  const block = lines.slice(idx + 1, end);

  // Segmentar por etiquetas
  const fields = { pregunta: [], sector_label: [], lo_que_dice: [], traduccion: [], impacto: [], fuentes: [] };
  let current = "pregunta";
  for (const line of block) {
    let matched = false;
    for (const { key, re } of LABELS) {
      const m = line.match(re);
      if (m) {
        current = key;
        if (m[1] && m[1].trim()) fields[key].push(m[1].trim());
        matched = true;
        break;
      }
    }
    if (!matched && line) fields[current].push(line);
  }

  const joinPar = (arr) => arr.join("\n\n").trim();
  fichas.push({
    orden,
    slug: slugify(sector),
    sector,
    pregunta: joinPar(fields.pregunta),
    lo_que_dice: joinPar(fields.lo_que_dice),
    traduccion: joinPar(fields.traduccion),
    impacto: joinPar(fields.impacto),
    fuentes: fields.fuentes.map((s) => s.trim()).filter(Boolean),
    icono: iconFor(sector),
  });
}

// ===== ASSERTS =====
let ok = true;
const fail = (msg) => { console.error("ASSERT FAILED:", msg); ok = false; };

if (fichas.length !== 31) fail(`se esperaban 31 fichas, hay ${fichas.length}`);
const slugs = new Set(fichas.map((f) => f.slug));
if (slugs.size !== 31) fail(`slugs únicos: ${slugs.size} (se esperaban 31)`);
for (const f of fichas) {
  for (const campo of ["sector", "pregunta", "lo_que_dice", "traduccion", "impacto", "slug", "icono"]) {
    if (!f[campo] || !String(f[campo]).trim()) fail(`ficha ${f.orden} (${f.sector}): campo "${campo}" vacío`);
  }
  if (!f.fuentes.length) console.warn(`AVISO: ficha ${f.orden} (${f.sector}) sin fuentes`);
}
// órdenes secuenciales 1..31
fichas.forEach((f, i) => { if (f.orden !== i + 1) fail(`orden no secuencial en posición ${i}: ${f.orden}`); });

if (!ok) process.exit(1);

writeFileSync(OUTPUT, JSON.stringify(fichas, null, 2) + "\n", "utf8");
console.log(`OK: ${fichas.length} fichas escritas en data/contracaja.json`);
console.log("Fuentes totales:", fichas.reduce((a, f) => a + f.fuentes.length, 0));
console.log("Iconos:", fichas.map((f) => `${f.orden}.${f.slug}→${f.icono}`).join(" "));
