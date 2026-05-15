import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

type CartLine = {
  product_id?: string;
  product_slug?: string;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
};

type Body = {
  email: string;
  full_name: string;
  phone?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  note?: string;
  rental_from?: string;
  rental_to?: string;
  items: CartLine[];
};

/** Vytvoří objednávku. Funguje pro přihlášené i hosty. */
export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body.email || !body.full_name || !body.items?.length) {
    return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
  }

  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  // Použijeme service role pro insert do orders (jednodušší pro hosty),
  // RLS pro hosty by vyžadoval public policy.
  const admin = createSupabaseAdmin();

  const total = body.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: body.email,
      full_name: body.full_name,
      phone: body.phone ?? null,
      street: body.street ?? null,
      city: body.city ?? null,
      postal_code: body.postal_code ?? null,
      note: body.note ?? null,
      rental_from: body.rental_from ?? null,
      rental_to: body.rental_to ?? null,
      total,
      status: "pending",
    })
    .select()
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: orderErr?.message ?? "Chyba" }, { status: 500 });
  }

  const items = body.items.map((i) => ({
    order_id: order.id,
    product_id: i.product_id ?? null,
    product_name: i.product_name,
    product_slug: i.product_slug ?? null,
    product_image: i.product_image ?? null,
    unit_price: i.unit_price,
    quantity: i.quantity,
  }));

  const { error: itemsErr } = await admin.from("order_items").insert(items);
  if (itemsErr) {
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  // Vyčistit košík přihlášeného uživatele
  if (user) {
    await admin.from("cart").delete().eq("user_id", user.id);
  }

  return NextResponse.json({ ok: true, order_number: order.order_number, id: order.id });
}

/** Historie objednávek přihlášeného uživatele */
export async function GET() {
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ orders: [] });

  const { data, error } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
