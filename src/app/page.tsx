import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

// Hero — single big product image on right, mint background, serif title left
const HERO_IMG =
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1600&q=85";

// 3-tile asymmetric grid: large left + 2 stacked right (alternating gray/white bg)
const TILES = {
  big: {
    title: "Fotopozadí",
    href: "/produkty?cat=L%C3%A1tkov%C3%A1%20pozad%C3%AD",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85",
    bg: "#efeeec",
  },
  topRight: {
    title: "LED světla",
    href: "/produkty?cat=Tematick%C3%A1%20pozad%C3%AD",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85",
    bg: "#f5f4f1",
  },
  botRight: {
    title: "Rekvizity",
    href: "/produkty?cat=Glitter%20%26%20Flitry",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
    bg: "#ffffff",
  },
};

const BRANDS = [
  { name: "MANGO", className: "text-2xl tracking-[0.2em] font-bold" },
  { name: "Pepe Jeans", className: "font-serif text-2xl italic font-medium" },
  { name: "asos", className: "text-3xl font-black lowercase italic" },
  { name: "ZARA", className: "text-2xl tracking-[0.4em] font-light" },
  { name: "M&S", className: "text-3xl font-black tracking-tight" },
];

export default function Home() {
  const popular = products.slice(0, 5);

  return (
    <>
      {/* 1. HERO — Halena style: mint bg, serif left, big image right */}
      <section className="bg-[var(--brand-soft)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[88vh] gap-8 py-12">
            <div className="order-2 lg:order-1 max-w-md animate-fade-up">
              <h1 className="font-serif text-6xl sm:text-7xl text-black leading-[1.05]">
                Prémiové dekorace
              </h1>
              <p className="font-serif text-xl mt-5 text-black/70">
                Detaily tvoří atmosféru
              </p>
              <div className="mt-10">
                <Link
                  href="/produkty"
                  className="inline-block text-[12px] tracking-[0.3em] uppercase text-black border-b border-black pb-2 hover:opacity-60 transition-opacity"
                >
                  Nakupovat
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-auto lg:h-[80vh] w-full">
              <Image
                src={HERO_IMG}
                alt="Dekorace"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASYMMETRIC TRIPTYCH — alternating gray/white bg */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        <Link
          href={TILES.big.href}
          className="group relative aspect-square lg:aspect-auto overflow-hidden"
          style={{ backgroundColor: TILES.big.bg }}
        >
          <Image
            src={TILES.big.img}
            alt={TILES.big.title}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-12 text-center">
            <h3 className="font-serif text-3xl text-white drop-shadow-lg">{TILES.big.title}</h3>
          </div>
        </Link>
        <div className="grid grid-rows-2">
          {[TILES.topRight, TILES.botRight].map(t => (
            <Link
              key={t.title}
              href={t.href}
              className="group relative overflow-hidden aspect-square lg:aspect-auto"
              style={{ backgroundColor: t.bg }}
            >
              <Image
                src={t.img}
                alt={t.title}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-y-0 right-12 flex items-center">
                <h3 className="font-serif text-3xl text-white drop-shadow-lg">{t.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. POPULAR ITEMS — header with prev/next, 5-col grid */}
      <section className="bg-[#efeeec]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
            <h2 className="font-serif text-4xl text-black">Oblíbené produkty</h2>
            <div className="flex items-center gap-6 text-sm text-black/70">
              <button className="hover:text-black transition-colors">Předchozí</button>
              <span className="text-black/30">/</span>
              <button className="hover:text-black transition-colors">Další</button>
              <div className="flex items-center gap-2 ml-3">
                <span className="w-2 h-2 rounded-full border border-black/30" />
                <span className="w-2 h-2 rounded-full border border-black/30" />
                <span className="w-2 h-2 rounded-full bg-black" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-14">
            {popular.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS — second row */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-black">Novinky</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-14">
            {products.slice(5, 10).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR BRANDS strip */}
      <section className="bg-[#efeeec]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <h3 className="font-serif text-2xl text-center text-black mb-14">Naše značky</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 items-center justify-items-center text-black">
            {BRANDS.map(b => (
              <span
                key={b.name}
                className={`${b.className} hover:opacity-60 transition-opacity cursor-pointer`}
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
