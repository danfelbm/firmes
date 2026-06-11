-- 001_initial_schema.sql
-- Esquema inicial: fichas (contracaja), noticias y enlaces.
-- Idempotente: create table if not exists / drop policy if exists.

create table if not exists public.fichas (
  id bigint generated always as identity primary key,
  orden smallint not null unique,
  slug text not null unique,
  sector text not null,
  pregunta text not null,
  lo_que_dice text not null,
  traduccion text not null,
  impacto text not null,
  fuentes jsonb not null default '[]',
  icono text not null default 'shield',
  created_at timestamptz not null default now()
);

create table if not exists public.noticias (
  id bigint generated always as identity primary key,
  slug text not null unique,
  titular text not null,
  resumen text not null,
  fecha date,
  periodista text,
  medio text,
  region text,
  tema text,
  link text not null,
  created_at timestamptz not null default now()
);

create index if not exists noticias_fecha_idx on public.noticias (fecha desc);
create index if not exists noticias_medio_idx on public.noticias (medio);
create index if not exists noticias_tema_idx on public.noticias (tema);

create table if not exists public.enlaces (
  id bigint generated always as identity primary key,
  tema text not null,
  fecha date,
  titulo text not null,
  url text not null,
  tipo text,
  observacion text,
  fuente text not null default 'archivo-xlsx',
  orden smallint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists enlaces_tema_idx on public.enlaces (tema);
create index if not exists enlaces_fuente_idx on public.enlaces (fuente);

-- RLS: lectura pública, CERO policies de escritura (solo service_role bypassa)
alter table public.fichas enable row level security;
alter table public.noticias enable row level security;
alter table public.enlaces enable row level security;

drop policy if exists "lectura publica fichas" on public.fichas;
drop policy if exists "lectura publica noticias" on public.noticias;
drop policy if exists "lectura publica enlaces" on public.enlaces;

create policy "lectura publica fichas" on public.fichas for select using (true);
create policy "lectura publica noticias" on public.noticias for select using (true);
create policy "lectura publica enlaces" on public.enlaces for select using (true);
