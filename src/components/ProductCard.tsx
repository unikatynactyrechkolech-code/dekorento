"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const BG_CYCLE = ["#efeeec", "#ffffff", "#f5f4f1", "#ffffff", "#efeeec"];

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { add } = useCart();
  const bg = BG_CYCLE[index % BG_CYCLE.length];

  return (
    <div className="group text-center">
      {/* Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        <Link href={`/produkt/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Outlined rectangle button — centered on image */}
        <Link
          href={`/produkt/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="border border-white text-white text-[11px] font-medium tracking-[0.25em] uppercase px-6 py-3 bg-black/10 backdrop-blur-[2px]">
            ZOBRAZIT
          </span>
        </Link>
      </div>

      {/* Meta */}
      <div className="pt-6 pb-2 relative">
        <Link
          href={`/produkt/${product.slug}`}
          className="font-serif text-[20px] text-black hover:opacity-60 transition-opacity"
        >
          {product.name}
        </Link>
        <div className="mt-2 relative h-7">
          <p className="font-serif text-[16px] text-black/70 absolute inset-x-0 group-hover:opacity-0 transition-opacity duration-200">
            {formatPrice(product.price)}
          </p>
          <button
            onClick={() => add(product)}
            className="font-serif text-[16px] text-black underline-offset-4 hover:underline absolute inset-x-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Buy product
          </button>
        </div>
      </div>
    </div>
  );
}
