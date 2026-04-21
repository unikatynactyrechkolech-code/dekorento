"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, total, isOpen, setOpen, setQty, remove } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h2 className="text-lg font-bold">
            Košík <span className="text-neutral-400 font-normal">({items.length})</span>
          </h2>
          <button onClick={() => setOpen(false)} className="p-2 -mr-2 hover:bg-neutral-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-neutral-600">Váš košík je prázdný</p>
            <button
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800"
            >
              Pokračovat v nákupu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
              {items.map(it => (
                <div key={it.id} className="flex gap-4 py-4">
                  <Link
                    href={`/produkt/${it.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0"
                  >
                    <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produkt/${it.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium leading-snug hover:underline line-clamp-2"
                    >
                      {it.name}
                    </Link>
                    <div className="mt-1 text-xs text-neutral-500">Pronájem / 1 den</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-neutral-200 rounded-full">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="p-1.5 hover:bg-neutral-100 rounded-full"
                          aria-label="Méně"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-sm font-medium min-w-[24px] text-center">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="p-1.5 hover:bg-neutral-100 rounded-full"
                          aria-label="Více"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold">{formatPrice(it.qty * it.price)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    className="p-1.5 self-start text-neutral-400 hover:text-red-500"
                    aria-label="Odebrat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Mezisoučet</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Celkem</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link
                href="/kosik"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-black hover:bg-neutral-800 text-white font-semibold py-3.5 rounded-full transition-colors"
              >
                Pokračovat k objednávce
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="block w-full text-center text-sm text-neutral-600 hover:text-black"
              >
                nebo nakupovat dál
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
