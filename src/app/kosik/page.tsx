"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black">Děkujeme za objednávku!</h1>
        <p className="mt-3 text-neutral-600">
          Tohle je demo verze — objednávka byla simulována. V brzké době bude k
          dispozici platba a rezervační kalendář.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 bg-black text-white px-7 py-3.5 rounded-full font-semibold"
        >
          Zpět na hlavní stránku <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center mb-6">
          <ShoppingBag className="w-7 h-7 text-neutral-400" />
        </div>
        <h1 className="text-3xl font-black">Košík je prázdný</h1>
        <p className="mt-3 text-neutral-600">
          Začněte výběrem některého z našich pozadí.
        </p>
        <Link
          href="/produkty"
          className="inline-flex items-center gap-2 mt-8 bg-black text-white px-7 py-3.5 rounded-full font-semibold"
        >
          Prohlédnout katalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-10">Košík</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        <div className="divide-y divide-neutral-100 border-y border-neutral-100">
          {items.map(it => (
            <div key={it.id} className="flex gap-4 sm:gap-6 py-6">
              <Link
                href={`/produkt/${it.slug}`}
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-neutral-100 shrink-0"
              >
                <Image src={it.image} alt={it.name} fill sizes="128px" className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-2">
                  <Link href={`/produkt/${it.slug}`} className="font-semibold hover:underline">
                    {it.name}
                  </Link>
                  <button
                    onClick={() => remove(it.id)}
                    className="text-neutral-400 hover:text-red-500 p-1 -mt-1"
                    aria-label="Odebrat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-neutral-500 mt-1">Pronájem / 1 den</div>
                <div className="mt-auto flex justify-between items-end">
                  <div className="flex items-center border border-neutral-200 rounded-full">
                    <button
                      onClick={() => setQty(it.id, it.qty - 1)}
                      className="p-2 hover:bg-neutral-100 rounded-full"
                      aria-label="Méně"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-sm font-medium min-w-[28px] text-center">{it.qty}</span>
                    <button
                      onClick={() => setQty(it.id, it.qty + 1)}
                      className="p-2 hover:bg-neutral-100 rounded-full"
                      aria-label="Více"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPrice(it.qty * it.price)}</div>
                    <div className="text-xs text-neutral-500">{formatPrice(it.price)} / ks</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 self-start bg-neutral-50 rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-bold">Souhrn objednávky</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Mezisoučet</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Doprava (Praha)</span>
              <span className="text-emerald-600 font-medium">Zdarma</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Vratná záloha</span>
              <span>{formatPrice(Math.round(total * 0.3))}</span>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg">
            <span>Celkem k úhradě</span>
            <span>{formatPrice(total + Math.round(total * 0.3))}</span>
          </div>
          <button
            onClick={() => {
              setSubmitted(true);
              clear();
            }}
            className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-4 rounded-full inline-flex items-center justify-center gap-2"
          >
            Dokončit objednávku <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-neutral-500 text-center">
            Demo režim — nevyžaduje platbu
          </p>
        </aside>
      </div>
    </div>
  );
}
