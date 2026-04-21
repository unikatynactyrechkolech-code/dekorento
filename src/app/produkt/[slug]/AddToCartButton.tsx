"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="inline-flex items-center justify-between border border-neutral-200 rounded-full px-2 py-1 sm:w-36">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="p-2 hover:bg-neutral-100 rounded-full"
          aria-label="Méně"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-semibold">{qty}</span>
        <button
          onClick={() => setQty(q => q + 1)}
          className="p-2 hover:bg-neutral-100 rounded-full"
          aria-label="Více"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={() => add(product, qty)}
        className="flex-1 bg-black hover:bg-neutral-800 text-white font-semibold py-3.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors"
      >
        <ShoppingBag className="w-4 h-4" /> Přidat do košíku
      </button>
    </div>
  );
}
