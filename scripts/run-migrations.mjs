// Ejecuta las migraciones SQL de supabase/migrations/ contra la base remota.
// Uso: node scripts/run-migrations.mjs
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import pg from "pg";

import { loadEnvLocal, ROOT } from "./lib/env.mjs";

loadEnvLocal();

const MIGRATIONS_DIR = resolve(ROOT, "supabase", "migrations");
const DIRECT_HOST = "db.rfypuobqaaxajjkhnqxx.supabase.co";

/** Construye URLs alternativas a partir de DATABASE_URL (pooler de sesión). */
function candidateUrls() {
  const base = process.env.DATABASE_URL;
  if (!base) {
    throw new Error("[migrations] DATABASE_URL no está definida en .env.local");
  }
  const urls = [{ label: "DATABASE_URL (session pooler)", url: base }];
  try {
    const parsed = new URL(base);
    const password = parsed.password;
    // Host directo: usuario `postgres` (sin sufijo de proyecto), puerto 5432.
    const direct = new URL(base);
    direct.hostname = DIRECT_HOST;
    direct.port = "5432";
    direct.username = "postgres";
    direct.password = password;
    urls.push({ label: `directo ${DIRECT_HOST}:5432`, url: direct.toString() });
    // Último recurso: transaction pooler (mismo host del pooler, puerto 6543).
    const txPooler = new URL(base);
    txPooler.port = "6543";
    urls.push({
      label: `transaction pooler ${txPooler.hostname}:6543`,
      url: txPooler.toString(),
    });
  } catch (err) {
    console.warn(`[migrations] No se pudieron construir URLs alternativas: ${err.message}`);
  }
  return urls;
}

async function connect() {
  let lastErr;
  for (const { label, url } of candidateUrls()) {
    const client = new pg.Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    try {
      console.log(`[migrations] Conectando vía ${label}...`);
      await client.connect();
      console.log(`[migrations] Conexión OK (${label})`);
      return client;
    } catch (err) {
      lastErr = err;
      console.warn(`[migrations] Falló ${label}: ${err.message}`);
      try {
        await client.end();
      } catch {
        // ignorar
      }
    }
  }
  throw new Error(`[migrations] No fue posible conectar a la base: ${lastErr?.message}`);
}

async function main() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("[migrations] No hay archivos .sql en supabase/migrations/");
    return;
  }

  const client = await connect();
  let failed = false;

  try {
    for (const file of files) {
      const sql = readFileSync(resolve(MIGRATIONS_DIR, file), "utf8");
      try {
        await client.query("begin");
        await client.query(sql);
        await client.query("commit");
        console.log(`[migrations] ${file} ... OK`);
      } catch (err) {
        await client.query("rollback").catch(() => {});
        console.error(`[migrations] ${file} ... ERROR: ${err.message}`);
        failed = true;
        break;
      }
    }

    const { rows } = await client.query(
      "select tablename from pg_tables where schemaname = 'public' order by tablename",
    );
    console.log(
      `[migrations] Tablas en public: ${rows.map((r) => r.tablename).join(", ") || "(ninguna)"}`,
    );
  } finally {
    await client.end();
  }

  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
