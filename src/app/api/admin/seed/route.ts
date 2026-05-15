import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import productsJson from "@/data/products.json";

/** Jednorázový import produktů z products.json do Supabase.
 *  Volá se z admin rozhraní tlačítkem. Existující produkty se přeskočí (upsert by slug). */
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = createSupabaseAdmin();
  type Raw = { id: string; slug: string; name: string; price: number; image: string; images: string[] };
  const rows = (productsJson as Raw[]).map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    stock: 1,
    image: p.image,
    images: p.images,
    description: `Pozadí ${p.name} – k zapůjčení.`,
    category: deriveCategory(p.name),
    tags: [],
    active: true,
  }));

  const { data, error } = await sb
    .from("products")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: false })
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: data?.length ?? 0 });
}

function deriveCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("glitter") || n.includes("flitr")) return "Glitter & Flitry";
  if (n.includes("třásn") || n.includes("trasn") || n.includes("stuh")) return "Třásně & Stuhy";
  if (n.includes("látkov") || n.includes("latkov") || n.includes("saténov") || n.includes("semišov"))
    return "Látková pozadí";
  return "Tematická pozadí";
}
