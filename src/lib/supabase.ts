import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Klientský Supabase — bezpečné použití v prohlížeči i na serveru */
export const supabase = createClient(url, anon);

/** Serverový Supabase s plným přístupem — POUZE v Server Actions / Route Handlers */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY není nastavený");
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
