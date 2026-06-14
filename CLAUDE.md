# Proyecto: Firmes por la Patria

Portal **satírico** sobre el candidato presidencial Abelardo de la Espriella (ADLE, "el Tigre"), elecciones Colombia 2026. Imita el estilo visual del sitio de su propia campaña (defensoresdelapatria.com) pero el contenido es material crítico/documentado, presentado con una voz cínica que parece oficial. Repo: `github.com/danfelbm/firmes`. Despliegue: Vercel conectado a GitHub.

---

## ⚠️ REGLA DE ORO DEL TONO (no romperla jamás)

El portal habla en registro **cínico-oficialista**: suena a sitio oficial de campaña — épico, patriótico, orgulloso, agradecido. El narrador **NUNCA critica**: celebra, presume "transparencia total" y presenta el contenido documentado (citas, condenas judiciales, demandas a periodistas) como **logros**. La crítica la hace el lector solo, por contraste deadpan.

- **PROHIBIDO en la voz del portal:** "veeduría", "denuncia", "contracampaña", "lo que realmente propone", "framing", cualquier acusación explícita.
- El análisis crítico ajeno se atribuye con sorna a **"los enemigos de la patria"** o **"los abogados aguafiestas"**.
- Ejemplos del registro: las fichas dicen *PALABRA DEL TIGRE / EN CRISTIANO / LO QUE LE TOCA A USTED*; la sección de prensa "agradece" los 52 artículos; el equipo de salud presume "amplia experiencia".
- **Los DATOS son intocables:** citas textuales, fichas, noticias, fuentes y todo lo de `data/*.json` se reproducen literalmente. La sátira vive SOLO en la capa editorial (títulos, kickers, intros, rótulos, CTAs, metadata).

Esta regla está por encima de cualquier otra; al editar copy, mantenerla.

---

## Stack

- **Next.js 16.2.1** (App Router, Turbopack) — ⚠️ tiene breaking changes vs. tu training data. Lee `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` antes de escribir código. Lo más relevante:
  - `params` y `searchParams` son **Promise** → `const { slug } = await params;`
  - `middleware.ts` se renombró a `proxy.ts` (no usamos middleware aquí)
  - Cambios en `next/image` y en las APIs de caché
- **React 19.2.4**, **TypeScript 5**
- **Tailwind CSS 4** — tema vía `@theme` en `app/globals.css`. **NO hay `tailwind.config.js`**. PostCSS con `@tailwindcss/postcss`.
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`). Node 20+ (dev usa v25).
- Iconos: `lucide-react` (ojo: la v1.x **eliminó los brand icons** — `Facebook`, `Youtube`, etc. no existen; usar SVG inline. También `Home`→`House`, `AlertTriangle`→`TriangleAlert`).

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción (debe quedar verde antes de commit)
npm run lint     # ESLint 9 (flat config)
npx tsc --noEmit --incremental false   # type-check aislado (útil en subagentes paralelos)
```

Pipeline de contenido y datos (ver sección Pipeline):
```bash
node scripts/extract-*.mjs        # insumos ~/Desktop → data/*.json
node scripts/run-migrations.mjs   # DDL + RLS (usa DATABASE_URL)
node scripts/seed-supabase.mjs    # data/*.json → tablas (upsert idempotente)
node scripts/upload-media.mjs     # audio → Storage bucket media
node scripts/verify-content.mjs   # 8 checks de completitud + RLS (debe dar 8/8)
```

---

## Estructura

```
app/                          # App Router (rutas kebab-case)
  layout.tsx                  # Poppins, metadata global, Navbar/Footer/AudioDock/WhatsAppButton
  page.tsx                    # home (async, ISR revalidate=3600)
  el-milagro/page.tsx         # índice de 31 fichas
  el-milagro/[slug]/page.tsx  # ficha individual (generateStaticParams → 31 SSG)
  prensa/page.tsx             # hemeroteca (DINÁMICA por searchParams: q, medio, tema, anio, page)
  compromisos/page.tsx        # expediente DDHH-DIH (SSG, lee data/expediente-ddhh.json)
  mensaje-a-las-victimas/page.tsx  # (SSG, lee data/victimas.json)
  equipo-salud/page.tsx       # dossier salud (SSG, lee data/salud.json)
  centro-de-documentacion/page.tsx # archivo de enlaces (DINÁMICA por searchParams: tema)
  globals.css                 # @theme (tokens) + @keyframes + utilidades
components/                   # 23 componentes PascalCase (ver abajo)
lib/
  supabase/client.ts          # createBrowserClient (browser, "use client")
  supabase/server.ts          # createServerClient con cookies (no usado en páginas SSG)
  supabase/static.ts          # createStaticClient SIN cookies → permite SSG/ISR. USAR ESTE en queries.
  supabase/types.ts           # tipos Database de las 3 tablas (escritos a mano)
  queries.ts                  # helpers de lectura (Server Components). Usa createStaticClient.
  constants.ts                # SITE_NAME, AUDIO_CALLE_URL, WHATSAPP_URL, NAV_LINKS, ARCHIVO_LINK
data/                         # JSON: fuente de verdad de prosa estática + intermedios del seed
  contracaja.json (31) · noticias.json (52) · enlaces.json (121) ·
  expediente-ddhh.json (7 secciones) · victimas.json (8 bloques + tabla) · salud.json (6)
scripts/                      # .mjs; cargan .env.local con scripts/lib/env.mjs (loadEnvLocal/adminClient)
supabase/migrations/          # 001_initial_schema.sql (tablas + índices + RLS)
public/                       # assets
```

### Rutas y redirects

Rutas actuales: `/el-milagro` (+31 slugs) · `/prensa` · `/compromisos` · `/mensaje-a-las-victimas` · `/equipo-salud` · `/centro-de-documentacion`. Las rutas históricas (`/la-contracaja`, `/hemeroteca`, `/expediente-ddhh`, `/la-voz-de-las-victimas`, `/el-negocio-de-la-salud`, `/archivo`) **redirigen 308** a las nuevas en `next.config.ts`. Si renombras una ruta, añade su redirect.

### Componentes (responsabilidad)

`Navbar` (client, sticky oscura, drawer móvil) · `Footer` (oscuro) · `Hero` + `FlagBackground` (bandera CSS) · `QuickAccessBar` (dock de accesos) · `SectionHeading` (h2 + highlight) · `Badge` · `CtaButton` (variants yellow/red/outline, flecha →) · `Card` · `FichaCard` (mapa explícito de iconos lucide) · `FichaTriangulo` (3 bloques de la ficha) · `NewsCard` (prop `compacto` = teaser 3 líneas en home; completo en prensa) · `NewsFilters` (client) · `Pagination` · `ExpedienteSection` (dos columnas) · `VictimaBlock` · `PropuestasRiesgosTable` · `EnlaceCard` (incluye render de "notas" sin URL) · `ArchivoFilters` · `AudioDock` (client, player flotante; oculto si `AUDIO_CALLE_URL` vacío) · `WhatsAppButton` · `Reveal` (client, IntersectionObserver threshold 0.1) · `StatCounter`.

---

## Base de datos (Supabase)

- **Proyecto:** `rfypuobqaaxajjkhnqxx` (`https://rfypuobqaaxajjkhnqxx.supabase.co`), región us-west-2. ⚠️ Es un proyecto **distinto** al de ivancepeda/pactoweb.
- **Tablas** (migración `supabase/migrations/001_initial_schema.sql`):
  - `fichas` (31): orden, slug, sector, pregunta, lo_que_dice, traduccion, impacto, fuentes (jsonb), icono
  - `noticias` (52): slug, titular, resumen, fecha, periodista, medio, region, tema, link
  - `enlaces` (127): tema, fecha, titulo, url, tipo, observacion, fuente (`archivo-xlsx` | `dossier-salud`), orden. Las "notas" del xlsx tienen `tipo='nota'` y `url=''`.
- **RLS:** habilitado en las 3 tablas. Policy `SELECT using(true)` (lectura pública); **cero policies de escritura** → anon/authenticated no pueden escribir, solo la service/secret key (que bypassa RLS) en los scripts.
- **Storage:** bucket público `media` con el audio (`calle-v3-mezcla.mp3`). URL pública cableada en `lib/constants.ts`.
- **DDL:** se ejecuta vía `scripts/run-migrations.mjs` (paquete `pg` + `DATABASE_URL`, session pooler).

### Queries (`lib/queries.ts`)

Todas usan `createStaticClient()` (sin cookies → SSG/ISR posible). Exportan tipos `Ficha`/`Noticia`/`Enlace` y: `getFichas`, `getFichaBySlug`, `getFichasDestacadas`, `getNoticias({tema,medio,anio,q,page,perPage})→{rows,total}`, `getNoticiasRecientes`, `getMediosYTemas`, `getEnlaces(tema?)`, `getTemasEnlaces()→{tema,count}[]`, `getEnlacesSalud`.

---

## Paleta y estilo (globals.css `@theme`) — LIGHT MODE

Fondo `cream #faf7f0` / superficies `paper #ffffff`; texto `ink #14143a`, secundario `muted #565672`; acentos `yellow #FFD23F` / `red #E63329` / `blue #2D5BFF`. El `navy #0d0d2b` (+navy-2/navy-3) se conserva SOLO como ancla oscura en **Navbar, Footer y el banner de cita del home** — dentro de esos bloques el texto va `text-white`/`text-white/70`.

Reglas de estilo:
- Tipografía **Poppins** (400–800), vía `next/font/google` en `layout.tsx`.
- Cards: `bg-paper border border-ink/10 .card-shadow`, barrita amarilla `.yellow-tick`, hover `border-yellow/60` + translate.
- **Amarillo NUNCA como color de texto sobre fondo claro** — solo como fondo/marker/subrayado. Highlight de títulos = estilo resaltador (`bg-yellow text-ink`).
- Links de acción: `text-blue hover:text-red`.
- Badges: pill amarilla, texto `ink`, uppercase.
- CTA con flecha →; `outline` = borde ink.
- Sin librerías de animación: solo CSS `@keyframes` (`fade-up`, `flag-wave`, `marquee`) + `Reveal` (IntersectionObserver).

---

## Convenciones de código

- **Server Components por defecto**; `"use client"` solo con hooks/handlers (Navbar, NewsFilters, AudioDock, Reveal).
- Componentes PascalCase en `components/`; rutas kebab-case.
- Contenido 100% en español, `<html lang="es">`.
- Imports de JSON estático para prosa con layout a medida (`compromisos`, `victimas`, `salud`); Supabase para datos consultables/filtrables (`fichas`, `noticias`, `enlaces`).
- **Conventional Commits**; commit inmediato tras cada cambio. No dejar archivos sin commitear.

---

## Seguridad

- `.env.local` **NUNCA** se commitea (está en `.gitignore`). Plantilla en `.env.example`.
- `SUPABASE_SECRET_KEY` y `DATABASE_URL` (password de la BD) solo se usan en `scripts/` (Node), **jamás** en `app/`/`components/` ni con prefijo `NEXT_PUBLIC_`.
- El sitio lee Supabase con la **publishable key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) vía RLS.
- `next.config.ts`: `images.remotePatterns` restringido a `rfypuobqaaxajjkhnqxx.supabase.co/storage/v1/object/public/**`; headers `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`.
- Links externos: `target="_blank" rel="noopener noreferrer nofollow"`.
- Antes de pushear: `grep -rn "sb_secret\|service_role\|DATABASE_URL" app/ components/ lib/` debe estar limpio (solo nombres de env vars públicas).
- ⚠️ Las keys de Supabase se compartieron en chat durante el desarrollo; el dueño (Daniel, `danfelbm`) las **rotará**. Si aparece un 401 en producción, probablemente ya rotó → actualizar la publishable en Vercel y en `.env.local`.

---

## Despliegue (Vercel)

Importar el repo. Configurar **solo** estas dos variables de entorno (el resto son de scripts locales y NO van en Vercel):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rfypuobqaaxajjkhnqxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la publishable key (`sb_publishable_...`) |

`metadataBase` en `layout.tsx` usa `NEXT_PUBLIC_SITE_URL` (fallback `firmes.vercel.app`); al asignar dominio propio, setear esa var.

---

## Pipeline de contenido (insumos fuente en ~/Desktop)

Los 7 insumos originales se extraen a `data/*.json` y de ahí se siembran:

| Insumo | Script | Destino |
|---|---|---|
| `Contracaja ADLE.docx` (31 fichas) | `extract-contracaja.mjs` (mammoth) | `fichas` → `/el-milagro` |
| `Noticias Abelardo - Hoja 1.csv` | `extract-noticias.mjs` (csv-parse) | `noticias` → `/prensa`. **52 registros reales** (las 72 "filas" eran celdas multilínea; ~10 sin resumen en la fuente) |
| `ADLE Y DDHH - DIH.pdf` (7 secciones, 2 columnas) | transcripción manual (pdftotext destroza el layout) | `data/expediente-ddhh.json` → `/compromisos` |
| `VICTIMAS AFECTACIONES DISCURSO ABELARDO.docx` | `extract-victimas.mjs` (mammoth HTML, preserva tabla) | `data/victimas.json` → `/mensaje-a-las-victimas` |
| `Insumos ... salud ....docx` (6 ítems) | `extract-salud.mjs` | `data/salud.json` + siembra en `enlaces` (fuente `dossier-salud`) → `/equipo-salud` |
| `Enlaces ... ADLE (3).xlsx` (17 hojas) | `extract-enlaces.mjs` (SheetJS) | `enlaces` → `/centro-de-documentacion`. **121 entradas** (117 con URL + 4 "notas" de texto sin URL preservadas). Itera TODAS las hojas, normaliza temas, valida fechas de calendario (la fuente trae 29/02/2026 inválida) |
| `CALLE v3_mezcla.mp3.mpeg` (7:38, ~10.5 MB) | `upload-media.mjs` | Storage `media/calle-v3-mezcla.mp3` → `AudioDock` |

`verify-content.mjs` debe dar **8/8**: fichas==31, noticias==52, enlaces archivo-xlsx==121, dossier-salud≥5, expediente 7 secciones, víctimas ≥7 bloques, audio HTTP 200, RLS bloquea INSERT anónimo.
