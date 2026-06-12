# Proyecto: Firmes por la Patria

Portal satírico sobre Abelardo de la Espriella (ADLE), elecciones Colombia 2026.

## REGLA DE ORO DEL TONO (no romperla jamás)

El portal habla en registro **cínico-oficialista**: suena a sitio oficial de campaña — épico, patriótico, orgulloso, agradecido. El narrador NUNCA critica: celebra, presume "transparencia total" y presenta el contenido documentado (citas, condenas, demandas) como logros. La crítica la hace el lector solo, por contraste. PROHIBIDO en la voz del portal: "veeduría", "denuncia", "contracampaña", "lo que realmente propone", cualquier acusación explícita. El análisis crítico ajeno se atribuye deadpan a "los enemigos de la patria" o "los abogados aguafiestas". Los DATOS (citas, fichas, noticias, data/*.json) son intocables: la sátira vive solo en la capa editorial.

Rutas: `/el-milagro` (+31 slugs) · `/prensa` · `/compromisos` · `/mensaje-a-las-victimas` · `/equipo-salud` · `/centro-de-documentacion` (las rutas viejas redirigen en next.config.ts).

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

## Paleta (globals.css @theme) — LIGHT MODE

Fondo `cream #faf7f0` / superficies `paper #ffffff`, texto `ink #14143a`, secundario `muted #565672`, acentos yellow `#FFD23F` / red `#E63329` / blue `#2D5BFF`. El navy `#0d0d2b` se conserva SOLO como ancla oscura en Navbar, Footer y el banner de cita del home. Tipografía: Poppins (400-800). Cards `bg-paper border-ink/10 .card-shadow` con barrita amarilla (`.yellow-tick`); highlight amarillo estilo resaltador (`bg-yellow text-ink`); amarillo NUNCA como color de texto sobre fondo claro; links de acción `text-blue hover:text-red`.

## Seguridad

- `.env.local` NUNCA se commitea. `SUPABASE_SECRET_KEY` y `DATABASE_URL` solo se usan en `scripts/` (Node), jamás en `app/`/`components/` ni con prefijo `NEXT_PUBLIC_`.
- El sitio lee Supabase con la publishable key vía RLS (tablas: SELECT público, escritura solo service role).

## Contenido (insumos fuente en ~/Desktop)

31 fichas Contracaja · 52 noticias CSV (72 líneas físicas = celdas multilínea) · expediente DDHH-DIH (PDF, 7 secciones) · víctimas (8 bloques + tabla) · dossier salud (6 ítems) · 121 enlaces XLSX (incluye 4 notas sin URL) · audio "CALLE" 7:38 en Storage. Los JSON intermedios viven en `data/`.
