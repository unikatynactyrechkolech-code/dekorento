import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
