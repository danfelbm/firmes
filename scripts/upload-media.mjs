// Sube el audio de campaña al bucket público `media` de Supabase Storage.
// Uso: node scripts/upload-media.mjs
import { readFileSync } from "node:fs";

import { adminClient } from "./lib/env.mjs";

const BUCKET = "media";
const SOURCE = "/Users/testuser/Desktop/CALLE v3_mezcla.mp3.mpeg";
const DEST = "calle-v3-mezcla.mp3";

const supabase = adminClient();

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "20MB",
  });
  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already exists") || error.statusCode === "409") {
      console.log(`[media] Bucket "${BUCKET}" ya existe.`);
      return;
    }
    throw new Error(`[media] createBucket: ${error.message}`);
  }
  console.log(`[media] Bucket "${BUCKET}" creado (público).`);
}

async function main() {
  await ensureBucket();

  const file = readFileSync(SOURCE);
  console.log(`[media] Subiendo ${SOURCE} (${(file.length / 1024 / 1024).toFixed(1)} MB)...`);

  const { error } = await supabase.storage.from(BUCKET).upload(DEST, file, {
    contentType: "audio/mpeg",
    upsert: true,
  });
  if (error) throw new Error(`[media] upload: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(DEST);
  console.log(`[media] Subido OK. URL pública: ${data.publicUrl}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
