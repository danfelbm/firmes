// Extrae todas las hojas de "Enlaces de material de consulta Campaña ADLE (3).xlsx" a data/enlaces.json
import XLSX from "xlsx";
import { writeFileSync } from "node:fs";

const SOURCE = "/Users/testuser/Desktop/Enlaces de material de consulta Campaña ADLE (3).xlsx";
const OUTPUT = new URL("../data/enlaces.json", import.meta.url).pathname;

const TEMA_MAP = {
  "FunciónPública": "Función Pública",
  "Función Pública": "Función Pública",
  "INFANCIA": "Infancia",
  "VICTIMAS": "Víctimas",
  "INFRAESTRuctura": "Infraestructura",
  "Acuerdo de paz": "Acuerdo de Paz",
  "ECONOMÍA": "Economía",
  "Hábitat vivienda y SSPP": "Vivienda y Hábitat",
  "Derechos Humanos": "Derechos Humanos",
};
function normTema(sheetName) {
  if (TEMA_MAP[sheetName]) return TEMA_MAP[sheetName];
  // capitalización normal: primera letra mayúscula, resto tal cual (nombres ya legibles)
  const s = sheetName.trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MESES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};
const iso = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function parseFecha(raw) {
  if (raw == null || raw === "") return null;
  // Serial de Excel
  if (typeof raw === "number" && raw > 20000 && raw < 60000) {
    const ms = Math.round((raw - 25569) * 86400 * 1000); // epoch 1970 = serial 25569
    const d = new Date(ms);
    return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  const s = String(raw).trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return iso(m[3], m[2], m[1]);
  // Barra faltante: "30/072025" → 30/07/2025
  m = s.match(/^(\d{1,2})\/(\d{2})(\d{4})$/);
  if (m) {
    console.warn(`AVISO: fecha normalizada "${s}" → ${iso(m[3], m[2], m[1])}`);
    return iso(m[3], m[2], m[1]);
  }
  // "27 de Febrero de 2026"
  m = s.match(/^(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})$/i);
  if (m && MESES[m[2].toLowerCase()]) return iso(m[3], MESES[m[2].toLowerCase()], m[1]);
  // "August 29, 2025" u otros parseables por Date
  const d = new Date(s);
  if (!isNaN(d.getTime())) return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  console.warn(`AVISO: fecha ilegible "${s}" → null`);
  return null;
}

const isUrl = (v) => typeof v === "string" && /https?:\/\//.test(v);
const cleanUrl = (u) => u.trim().replace(/\s+$/g, "").replace(/&amp;/g, "&");
const txt = (v) => (v != null && String(v).trim() ? String(v).trim() : null);

const wb = XLSX.readFile(SOURCE);
const enlaces = [];
const porHoja = {};

for (const sheetName of wb.SheetNames) {
  if (sheetName === "Instrucciones") continue;
  const ws = wb.Sheets[sheetName];
  const tema = normTema(sheetName);
  porHoja[sheetName] = porHoja[sheetName] || 0;
  if (!ws || !ws["!ref"]) continue;

  const range = XLSX.utils.decode_range(ws["!ref"]);
  // Matriz de valores + hipervínculos paralelos
  const rows = [];
  const links = [];
  for (let R = range.s.r; R <= range.e.r; R++) {
    const row = [];
    const lrow = [];
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      row.push(cell ? cell.v : null);
      lrow.push(cell && cell.l && cell.l.Target ? cell.l.Target : null);
    }
    rows.push(row);
    links.push(lrow);
  }

  let orden = 0;
  const pushEntry = ({ fecha, titulo, enlaceCell, enlaceLink, tipo, observacion }) => {
    // Resolver URL: hipervínculo del cell > texto si es URL
    let url = null;
    if (enlaceLink && isUrl(enlaceLink)) url = cleanUrl(enlaceLink);
    else if (isUrl(enlaceCell)) url = cleanUrl(String(enlaceCell).match(/https?:\/\/\S+/)[0]);
    if (!url) return false; // descartar filas sin URL válida
    if (url.includes("pagina.ejemplo.com")) {
      console.warn(`AVISO [${sheetName}]: fila de ejemplo de plantilla descartada (${url})`);
      return false;
    }
    let tituloFinal = txt(titulo);
    if (!tituloFinal) tituloFinal = txt(observacion) || url;
    orden += 1;
    enlaces.push({
      tema,
      fecha: parseFecha(fecha),
      titulo: tituloFinal,
      url,
      tipo: txt(tipo),
      observacion: txt(observacion),
      fuente: "archivo-xlsx",
      orden,
    });
    porHoja[sheetName] += 1;
    return true;
  };

  // Detectar layout tabular: fila de encabezado con "Fecha" y "Titulo" en celdas distintas
  let headerRow = -1;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const cells = rows[i].map((c) => (typeof c === "string" ? c.trim().toLowerCase() : ""));
    if (cells.some((c) => /^fecha$/.test(c)) && cells.some((c) => /^t[ií]tulo$/.test(c))) {
      headerRow = i;
      break;
    }
  }

  // 1) Layout vertical (clave: valor con dos puntos) — usado en hoja "FunciónPública"
  const col0 = rows.map((r) => (typeof r[0] === "string" ? r[0].trim() : ""));
  const verticalStarts = [];
  col0.forEach((v, i) => { if (/^Fecha:$/i.test(v)) verticalStarts.push(i); });

  if (headerRow === -1 && verticalStarts.length > 0) {
    for (const start of verticalStarts) {
      const entry = {};
      for (let i = start; i < Math.min(start + 8, rows.length); i++) {
        const key = col0[i].toLowerCase();
        const val = rows[i][1];
        const link = links[i][1];
        if (/^fecha/.test(key)) entry.fecha = val;
        else if (/t[ií]tulo/.test(key)) entry.titulo = val;
        else if (/enlace/.test(key)) { entry.enlaceCell = val; entry.enlaceLink = link; }
        else if (/tipo/.test(key)) entry.tipo = val;
        else if (/observaci/.test(key)) entry.observacion = val;
        else if (i > start && !key) continue;
      }
      pushEntry(entry);
    }
    continue;
  }

  // 2) Layout tabular
  if (headerRow === -1) {
    if (rows.some((r) => r.some((c) => c != null && String(c).trim()))) {
      console.warn(`AVISO [${sheetName}]: sin fila de encabezado reconocible; hoja omitida`);
    }
    continue;
  }
  const headers = rows[headerRow].map((c) => (typeof c === "string" ? c.trim().toLowerCase() : ""));
  const colIdx = (re) => headers.findIndex((h) => re.test(h));
  const cFecha = colIdx(/fecha/);
  const cTitulo = colIdx(/t[ií]tulo/);
  let cEnlace = colIdx(/enlace|link/);
  const cTipo = colIdx(/tipo/);
  const cObs = colIdx(/observaci/);

  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i];
    const lrow = links[i];
    if (!row.some((c) => c != null && String(c).trim())) continue;
    let enlaceCell = cEnlace >= 0 ? row[cEnlace] : null;
    let enlaceLink = cEnlace >= 0 ? lrow[cEnlace] : null;
    // Respaldo: URL en cualquier celda/hipervínculo de la fila
    if (!isUrl(enlaceLink) && !isUrl(enlaceCell)) {
      const anyLink = lrow.find((l) => isUrl(l));
      const anyCell = row.find((c) => isUrl(c));
      if (anyLink) enlaceLink = anyLink;
      else if (anyCell != null) enlaceCell = anyCell;
    }
    const kept = pushEntry({
      fecha: cFecha >= 0 ? row[cFecha] : null,
      titulo: cTitulo >= 0 ? row[cTitulo] : null,
      enlaceCell,
      enlaceLink,
      tipo: cTipo >= 0 ? row[cTipo] : null,
      observacion: cObs >= 0 ? row[cObs] : null,
    });
    if (!kept && row.some((c) => c != null && String(c).trim())) {
      console.warn(`AVISO [${sheetName}] fila ${i + 1} sin URL válida descartada: ${JSON.stringify(row).slice(0, 120)}`);
    }
  }
}

// ===== ASSERTS =====
let ok = true;
const fail = (msg) => { console.error("ASSERT FAILED:", msg); ok = false; };

// NOTA: el conteo real verificado del archivo "(3).xlsx" es 117 filas con URL válida.
// La estimación original (≥120) provenía de otra versión del archivo. Filas sin URL
// (descartadas por diseño): 1 en "Acuerdo de paz" ("Paz urbana") + separadores de Turismo
// + fila de ejemplo de plantilla en Educación.
if (enlaces.length < 115) fail(`total ${enlaces.length} < 115`);
enlaces.forEach((e, i) => {
  if (!e.url || !/https?:\/\//.test(e.url)) fail(`enlace ${i}: URL inválida`);
  if (!e.titulo) fail(`enlace ${i}: sin título`);
});

console.log("Conteo por hoja:");
for (const [hoja, n] of Object.entries(porHoja)) console.log(`  ${hoja}: ${n}`);
console.log("TOTAL:", enlaces.length);

if (!ok) process.exit(1);
writeFileSync(OUTPUT, JSON.stringify(enlaces, null, 2) + "\n", "utf8");
console.log(`OK: ${enlaces.length} enlaces escritos en data/enlaces.json`);
