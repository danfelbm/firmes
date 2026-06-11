// Utilidades compartidas para scripts: carga de .env.local y cliente admin de Supabase.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Lee `.env.local` de la raíz del proyecto y setea process.env.
 * Parse manual línea a línea; ignora comentarios y líneas vacías.
 * No sobreescribe variables ya presentes en el entorno.
 */
export function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  let raw;
  try {
    raw = readFileSync(envPath, "utf8");
  } catch {
    console.warn(`[env] No se encontró ${envPath}`);
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Quita comillas envolventes si las hay
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

/**
 * Cliente de Supabase con la secret key (server-only, bypassa RLS).
 */
export function adminClient() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "[env] Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local",
    );
  }
  return createClient(url, secret, {
    auth: { persistSession: false },
  });
}

/**
 * Cliente de Supabase con la anon/publishable key (sujeto a RLS).
 * Útil para verificar que las policies bloquean escritura.
 */
export function anonClient() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "[env] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
    );
  }
  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}

export { ROOT };
