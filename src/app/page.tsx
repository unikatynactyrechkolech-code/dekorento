import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

// Free Unsplash imagery — party / event decoration & furniture rental
const HERO =
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1600&q=85";

const CAT_LARGE = {
  title: "Glitter & Flitry",
  href: "/produkty?cat=Glitter%20%26%20Flitry",
  img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=85",
};
const CAT_TOP = {
  title: "Látková pozadí",
  href: "/produkty?cat=L%C3%A1tkov%C3%A1%20pozad%C3%AD",
  img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  bg: "#eeece8",
};
const CAT_BOT = {
  title: "Tematická pozadí",
  href: "/produkty?cat=Tematick%C3%A1%20pozad%C3%AD",
  img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
  bg: "#f5f3ef",
};

const BRANDS = [
  { name: "VOGUE", className: "font-serif text-3xl tracking-[0.15em] font-bold" },
  { name: "elle", className: "font-serif text-4xl italic font-medium" },
  { name: "MARIE CLAIRE", className: "text-sm tracking-[0.4em] font-light" },
  { name: "ARCHITECTURAL", className: "text-xs tracking-[0.5em] font-bold" },
  { name: "Domino", className: "font-serif text-3xl italic" },
];

export default function Home() {
  const popular = products.slice(0, 5);

  return (
    <>
      {/* 1. HERO — Halena split, turquoise bg, serif left, image right */}
      <section className="bg-[var(--brand-soft)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[80vh] gap-8 py-12">
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
                  className="inline-block text-[13px] tracking-[0.25em] uppercase text-black border-b border-black pb-2 hover:opacity-60 transition-opacity"
                >
                  Nakupovat
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-auto lg:h-[80vh] w-full">
              <Image
                src={HERO}
                alt="Dekorace"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASYMMETRIC CATEGORY GRID — Halena: big left + 2 stacked right */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* big left */}
        <Link
          href={CAT_LARGE.href}
          className="group relative bg-[#e7e5e1] aspect-square lg:aspect-auto overflow-hidden"
        >
          <Image
            src={CAT_LARGE.img}
            alt={CAT_LARGE.title}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-12 text-center">
            <h3 className="font-serif text-3xl text-black">{CAT_LARGE.title}</h3>
          </div>
        </Link>

        {/* right column: 2 stacked */}
        <div className="grid grid-rows-2">
          <Link
            href={CAT_TOP.href}
            className="group relative overflow-hidden aspect-square lg:aspect-auto"
            style={{ backgroundColor: CAT_TOP.bg }}
          >
            <Image
              src={CAT_TOP.img}
              alt={CAT_TOP.title}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-y-0 right-12 flex items-center">
              <h3 className="font-serif text-3xl text-black">{CAT_TOP.title}</h3>
            </div>
          </Link>
          <Link
            href={CAT_BOT.href}
            className="group relative overflow-hidden aspect-square lg:aspect-auto bg-white"
          >
            <Image
              src={CAT_BOT.img}
              alt={CAT_BOT.title}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-y-0 right-12 flex items-center">
              <h3 className="font-serif text-3xl text-black">{CAT_BOT.title}</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. POPULAR ITEMS — minimalist Halena grid */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
        <h2 className="font-serif text-3xl text-center text-black mb-14">
          Oblíbené produkty
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-14">
          {popular.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. OUR BRANDS strip */}
      <section className="border-t border-neutral-100">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <h3 className="font-serif text-2xl text-center text-black mb-12">
            Naše značky
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 items-center justify-items-center text-black">
            {BRANDS.map(b => (
              <span key={b.name} className={`${b.className} hover:opacity-60 transition-opacity cursor-pointer`}>
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS — second product grid */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-24">
        <h2 className="font-serif text-3xl text-center text-black mb-14">
          Novinky
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-14">
          {products.slice(5, 10).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
