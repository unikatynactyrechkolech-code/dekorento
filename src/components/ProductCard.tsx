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

        {/* Quick view pill */}
        <Link
          href={`/produkt/${product.slug}`}
          className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-black text-white text-[11px] tracking-wide px-4 py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          Quick View
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
