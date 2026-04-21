"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    setResults(searchProducts(q));
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-w-3xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
            <Search className="w-5 h-5 text-neutral-500" />
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Hledat pozadí, dekorace…"
              className="flex-1 outline-none text-base placeholder:text-neutral-400"
            />
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {q && results.length === 0 && (
              <div className="p-10 text-center text-neutral-500 text-sm">
                Žádné výsledky pro „{q}"
              </div>
            )}
            {!q && (
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">
                  Oblíbené
                </p>
                <div className="flex flex-wrap gap-2">
                  {["glitter", "růžové", "svatba", "zlaté", "vesmír"].map(t => (
                    <button
                      key={t}
                      onClick={() => setQ(t)}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm capitalize"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {results.map(p => (
              <Link
                key={p.id}
                href={`/produkt/${p.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 border-t border-neutral-100"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-neutral-500">{p.category}</div>
                </div>
                <div className="text-sm font-semibold">{formatPrice(p.price)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
