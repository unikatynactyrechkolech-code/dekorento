import { createSupabaseAdmin } from "@/lib/supabase/server";
import OrdersList from "./OrdersList";
import type { DbOrder, DbOrderItem } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export type OrderWithItems = DbOrder & { order_items: DbOrderItem[] };

export default async function AdminOrdersPage() {
  const sb = createSupabaseAdmin();
  const { data } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Objednávky</h1>
        <p className="text-neutral-500 mt-1">Správa a stavy objednávek</p>
      </div>
      <OrdersList initial={(data ?? []) as OrderWithItems[]} />
    </div>
  );
}
