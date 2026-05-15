import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const sb = createSupabaseAdmin();
  const [{ count: productCount }, { count: orderCount }, { data: pending }] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("orders").select("*", { count: "exact", head: true }),
    sb.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Přehled</h1>
        <p className="text-neutral-500 mt-1">Správa e-shopu Dekorento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Produktů" value={productCount ?? 0} href="/admin/produkty" />
        <Stat label="Objednávek celkem" value={orderCount ?? 0} href="/admin/objednavky" />
        <Stat label="Nezpracované" value={pending?.length ?? 0} href="/admin/objednavky" highlight />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-bold mb-3">Rychlé akce</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/produkty" className="bg-black text-white rounded-full px-5 py-2.5 text-sm font-medium">
            Spravovat produkty
          </Link>
          <Link href="/admin/objednavky" className="bg-neutral-100 hover:bg-neutral-200 rounded-full px-5 py-2.5 text-sm font-medium">
            Zpracovat objednávky
          </Link>
          <SeedButton />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, href, highlight }: { label: string; value: number; href: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border p-6 transition ${
        highlight ? "bg-amber-50 border-amber-200 hover:border-amber-400" : "bg-white border-neutral-200 hover:border-black"
      }`}
    >
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-4xl font-black mt-2">{value}</div>
    </Link>
  );
}

function SeedButton() {
  return (
    <form action="/api/admin/seed" method="post">
      <button
        type="submit"
        className="bg-neutral-100 hover:bg-neutral-200 rounded-full px-5 py-2.5 text-sm font-medium"
        formMethod="post"
      >
        Importovat produkty z JSON
      </button>
    </form>
  );
}
