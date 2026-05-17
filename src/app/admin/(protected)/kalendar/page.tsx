import { createSupabaseAdmin } from "@/lib/supabase/server";
import KalendarClient from "./KalendarClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kalendář rezervací — Admin" };

export default async function KalendarPage() {
  const admin = createSupabaseAdmin();
  const { data: products } = await admin
    .from("products")
    .select("id, name, slug, category")
    .eq("active", true)
    .neq("slug", "konstrukce-stojan")
    .order("name");

  return <KalendarClient products={products ?? []} />;
}
