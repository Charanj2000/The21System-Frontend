import { createClient } from "@/lib/supabase/client";

type SupabaseClient = ReturnType<typeof createClient>;

let instance: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (instance) return instance;
  instance = createClient();
  return instance;
}

/**
 * Lazy proxy so (a) SSR never instantiates the browser client and (b) the
 * module can be imported even when VITE_* env vars are missing — the error
 * only surfaces when something actually tries to use Supabase.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
