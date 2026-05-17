import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { email, name, source } = await req.json().catch(() => ({}));

  if (!email || !EMAIL_RX.test(email)) {
    return NextResponse.json({ error: "Neplatný e-mail" }, { status: 400 });
  }

  const sb = createSupabaseAdmin();
  const { error } = await sb
    .from("newsletter_subscribers")
    .upsert(
      {
        email: email.toLowerCase().trim(),
        name: name ?? null,
        source: source ?? "web",
        unsubscribed_at: null,
      },
      { onConflict: "email", ignoreDuplicates: false }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
