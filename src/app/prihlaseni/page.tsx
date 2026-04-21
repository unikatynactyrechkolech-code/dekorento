"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (!r.ok) setErr(r.error || "Chyba přihlášení");
    else router.push("/profil");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-4xl font-black tracking-tight">Přihlášení</h1>
      <p className="mt-2 text-neutral-500">Vítejte zpět.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1.5 w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Heslo
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1.5 w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
          />
        </div>
        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {err}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
        >
          {loading ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-600 text-center">
        Nemáte účet?{" "}
        <Link href="/registrace" className="font-semibold underline">
          Vytvořit účet
        </Link>
      </p>
    </div>
  );
}
