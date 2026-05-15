import { createSupabaseAdmin } from "@/lib/supabase/server";
import ProductsTable from "./ProductsTable";
import type { DbProduct } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const sb = createSupabaseAdmin();
  const { data } = await sb.from("products").select("*").order("created_at", { ascending: false });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Produkty</h1>
          <p className="text-neutral-500 mt-1">Správa katalogu</p>
        </div>
      </div>
      <ProductsTable initial={(data ?? []) as DbProduct[]} />
    </div>
  );
}
