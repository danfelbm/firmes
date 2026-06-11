import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

/**
 * Cliente de Supabase SIN cookies, para lecturas públicas en Server
 * Components y generateStaticParams. Al no tocar cookies(), las páginas
 * pueden prerenderizarse estáticamente. Solo lectura (publishable key + RLS).
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
