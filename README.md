# Firmes por la Patria

Portal satírico en registro cínico-oficialista sobre el candidato Abelardo de la Espriella (elecciones Colombia 2026): suena a sitio oficial de campaña, pero publica íntegro el material documentado — el Milagro sector por sector (31 fichas), 18 años de prensa (52 artículos), los compromisos en DDHH y DIH, el mensaje a las víctimas, el equipo de salud y un centro de documentación con 127 fuentes. Light mode institucional-patriótico.

## Stack

- **Next.js 16.2.1** (App Router, Turbopack) + React 19 + TypeScript 5
- **Tailwind CSS 4** (tema vía `@theme` en `app/globals.css`)
- **Supabase**: tablas `fichas`, `noticias`, `enlaces` (RLS: lectura pública, escritura solo service role) + Storage (bucket `media` con el audio "CALLE")

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev
```

## Despliegue en Vercel

Importar el repo y configurar SOLO estas variables de entorno:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rfypuobqaaxajjkhnqxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la publishable key (`sb_publishable_...`) |

`SUPABASE_SECRET_KEY` y `DATABASE_URL` **no** se configuran en Vercel: solo los usan los scripts locales de seed/migración.

## Pipeline de contenido

Los insumos fuente (docx/csv/xlsx/pdf/mp3) se convierten a JSON en `data/` y se siembran en Supabase:

```bash
node scripts/extract-contracaja.mjs    # docx → data/contracaja.json (31 fichas)
node scripts/extract-noticias.mjs      # csv  → data/noticias.json (52)
node scripts/extract-enlaces.mjs       # xlsx → data/enlaces.json (121, incluye 4 notas)
node scripts/extract-victimas.mjs      # docx → data/victimas.json (8 bloques + tabla)
node scripts/extract-salud.mjs         # docx → data/salud.json (6 ítems)
node scripts/run-migrations.mjs        # DDL + RLS (usa DATABASE_URL)
node scripts/seed-supabase.mjs         # upsert idempotente
node scripts/upload-media.mjs          # audio → Storage media/
node scripts/verify-content.mjs        # 8 checks de completitud + RLS
```

`data/expediente-ddhh.json` es transcripción manual fiel del PDF (4 páginas, layout a dos columnas) y se renderiza estático, igual que `victimas.json` y `salud.json`.

## Rutas

`/` · `/el-milagro` (+31 fichas SSG) · `/prensa` (filtros y búsqueda) · `/compromisos` · `/mensaje-a-las-victimas` · `/equipo-salud` · `/centro-de-documentacion` (filtro por tema). Las rutas anteriores (`/la-contracaja`, `/hemeroteca`, etc.) redirigen permanentemente.
