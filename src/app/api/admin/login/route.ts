import { NextResponse } from "next/server";
import { checkAdminPassword, makeAdminToken, setAdminCookie } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ ok: false, error: "Nesprávné heslo" }, { status: 401 });
  }
  await setAdminCookie(makeAdminToken());
  return NextResponse.json({ ok: true });
}
