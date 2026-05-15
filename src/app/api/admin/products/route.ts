import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .insert({
      slug: body.slug,
      name: body.name,
      description: body.description ?? null,
      price: body.price,
      stock: body.stock ?? 0,
      image: body.image ?? null,
      images: body.images ?? [],
      category: body.category ?? null,
      tags: body.tags ?? [],
      badge: body.badge ?? null,
      active: body.active ?? true,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product: data });
}
