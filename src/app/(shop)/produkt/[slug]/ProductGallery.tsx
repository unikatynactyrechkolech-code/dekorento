"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length ? images : [];
  if (!gallery.length) return null;

  return (
    <div className="space-y-3">
      {/* Hlavní obrázek */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
        <Image
          src={gallery[active]}
          alt={name}
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-200"
          priority
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Thumbnaily */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border-2 transition-colors ${
                active === i ? "border-black" : "border-transparent hover:border-neutral-300"
              }`}
            >
              <Image src={img} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
