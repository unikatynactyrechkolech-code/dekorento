import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

// Veřejné API — vrací rezervované rozsahy pro produkt
// GET /api/availability?product_id=xxx&months=3
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  const from = new Date();
  from.setDate(1);
  const to = new Date();
  to.setMonth(to.getMonth() + 3);

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("reservations")
    .select("id, reserved_from, reserved_to")
    .eq("product_id", product_id)
    .gte("reserved_to", from.toISOString().split("T")[0])
    .lte("reserved_from", to.toISOString().split("T")[0])
    .order("reserved_from");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reservations: data ?? [] });
}
