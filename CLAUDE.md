# Proyecto: Firmes por la Patria

Portal de veeduría/contracampaña sobre Abelardo de la Espriella (ADLE), elecciones Colombia 2026. Replica el estilo visual de defensoresdelapatria.com (el sitio de la propia campaña de ADLE) con contenido crítico.

## Stack

- Next.js 16.2.1 (App Router) — **OJO: breaking changes vs. tu training data; lee `node_modules/next/dist/docs/` antes de escribir código** (params/searchParams son Promise, `proxy.ts` en vez de middleware, etc.)
- React 19.2.4, TypeScript 5
- Tailwind CSS 4 (tema vía `@theme` en `app/globals.css`, NO hay tailwind.config)
- Supabase (`@supabase/ssr`): clientes en `lib/supabase/`. Tablas: `fichas`, `noticias`, `enlaces`. Storage bucket `media`.

## Comandos

- `npm run dev` / `npm run build` / `npm run lint`
- Migraciones: `node scripts/run-migrations.mjs`
- Pipeline de contenido: `node scripts/extract-*.mjs` → `data/*.json` → `node scripts/seed-supabase.mjs`
- Verificación de contenido: `node scripts/verify-content.mjs`

## Convenciones

- Server Components por defecto; `"use client"` solo con hooks/handlers
- Sin librerías de animación: CSS `@keyframes` + `Reveal.tsx` (IntersectionObserver, threshold 0.1)
- Componentes PascalCase en `components/`; rutas kebab-case
- Contenido 100% en español, `<html lang="es">`
- Conventional Commits; **commit inmediato tras cada cambio**

## Paleta (globals.css @theme)

navy `#0d0d2b` (fondo), navy-2 `#101035`, yellow `#FFD23F`, red `#E63329`, blue `#2D5BFF`, muted `#b8b8cf`. Tipografía: Poppins (400-800). Badges amarillos uppercase texto ink; CTA con flecha →; cards oscuras `border-white/10` con barrita amarilla (`.yellow-tick`).

## Seguridad

- `.env.local` NUNCA se commitea. `SUPABASE_SECRET_KEY` y `DATABASE_URL` solo se usan en `scripts/` (Node), jamás en `app/`/`components/` ni con prefijo `NEXT_PUBLIC_`.
- El sitio lee Supabase con la publishable key vía RLS (tablas: SELECT público, escritura solo service role).

## Contenido (insumos fuente en ~/Desktop)

31 fichas Contracaja · 72 noticias CSV · expediente DDHH-DIH (PDF, 7 secciones) · víctimas (8 bloques + tabla) · dossier salud · ~133 enlaces XLSX (17 hojas) · audio "CALLE" 7:38 en Storage. Los JSON intermedios viven en `data/`.
