import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("reservations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
