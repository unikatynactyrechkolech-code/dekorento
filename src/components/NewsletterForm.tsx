"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function NewsletterForm({ source = "web" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Chyba");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-emerald-600">
        <Check className="w-4 h-4" /> Děkujeme za přihlášení!
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-2 max-w-md">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vas@email.cz"
          className="w-full bg-white border border-neutral-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-black"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="bg-black text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50"
      >
        {busy ? "…" : "Odebírat"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </form>
  );
}
