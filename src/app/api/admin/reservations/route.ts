import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  const admin = createSupabaseAdmin();
  let q = admin.from("reservations").select("*, products(name, slug)").order("reserved_from");
  if (product_id) q = q.eq("product_id", product_id);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reservations: data });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const { product_id, reserved_from, reserved_to, note } = body;
  if (!product_id || !reserved_from || !reserved_to)
    return NextResponse.json({ error: "Chybí povinné hodnoty" }, { status: 400 });
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("reservations")
    .insert({ product_id, reserved_from, reserved_to, note: note || null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reservation: data });
}
