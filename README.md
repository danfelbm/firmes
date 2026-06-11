# Firmes por la Patria

Portal de veeduría ciudadana sobre el candidato Abelardo de la Espriella (elecciones Colombia 2026). Publica íntegros los insumos de investigación: la Contracaja de 31 fichas sectoriales, 52 noticias de prensa (2008–2026), el expediente de DDHH y DIH, la voz de las víctimas, el dossier del negocio de la salud y un archivo de 127 fuentes documentadas.

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

`/` · `/la-contracaja` (+31 fichas SSG) · `/hemeroteca` (filtros y búsqueda) · `/expediente-ddhh` · `/la-voz-de-las-victimas` · `/el-negocio-de-la-salud` · `/archivo` (filtro por tema)
