import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

// Hero category showcase — 4 sloupce s průhledným tlačítkem
const HERO_CATS = [
  {
    label: "FOTOPOZADÍ",
    href: "/produkty?cat=L%C3%A1tkov%C3%A1%20pozad%C3%AD",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
    bg: "#efe9dd",
    light: true,
  },
  {
    label: "LED SVĚTLA + PÍSMENA",
    href: "/produkty?cat=Tematick%C3%A1%20pozad%C3%AD",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=85",
    bg: "#0a0a0a",
    light: false,
  },
  {
    label: "REKVIZITY",
    href: "/produkty?cat=Glitter%20%26%20Flitry",
    img: "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=900&q=85",
    bg: "#f3f1ed",
    light: true,
  },
  {
    label: "INSTAX",
    href: "/produkty",
    img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85",
    bg: "#dcdad4",
    light: true,
  },
];

const SECONDARY = [
  {
    title: "Glitter & Flitry",
    href: "/produkty?cat=Glitter%20%26%20Flitry",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Látková pozadí",
    href: "/produkty?cat=L%C3%A1tkov%C3%A1%20pozad%C3%AD",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Tematická pozadí",
    href: "/produkty?cat=Tematick%C3%A1%20pozad%C3%AD",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
  },
];

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
      {/* 1. HERO — 4-column category showcase */}
      <section className="grid grid-cols-2 lg:grid-cols-4 min-h-[80vh]">
        {HERO_CATS.map(c => (
          <Link
            key={c.label}
            href={c.href}
            className="group relative overflow-hidden flex items-center justify-center aspect-[3/4] lg:aspect-auto"
            style={{ backgroundColor: c.bg }}
          >
            <Image
              src={c.img}
              alt={c.label}
              fill
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <span
              className={`relative z-10 px-7 py-3.5 border text-[12px] font-semibold tracking-[0.25em] uppercase transition-all duration-300
                ${
                  c.light
                    ? "border-black text-black bg-white/0 group-hover:bg-white"
                    : "border-white text-white group-hover:bg-white group-hover:text-black"
                }`}
            >
              {c.label}
            </span>
          </Link>
        ))}
      </section>

      {/* 2. INTRO line */}
      <section className="bg-[var(--brand-soft)]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-black leading-tight">
            Detaily tvoří atmosféru
          </h2>
          <p className="mt-4 text-sm sm:text-base text-black/70 max-w-xl mx-auto">
            Půjčovna prémiových fotopozadí, LED dekorací, rekvizit a Instax
            kamer pro vaše akce. Doručíme, postavíme, odvezeme.
          </p>
        </div>
      </section>

      {/* 3. ASYMMETRIC TRIPTYCH */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        <Link href={SECONDARY[0].href} className="group relative bg-[#e7e5e1] aspect-square lg:aspect-auto overflow-hidden">
          <Image
            src={SECONDARY[0].img}
            alt={SECONDARY[0].title}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-12 text-center">
            <h3 className="font-serif text-3xl text-white drop-shadow-lg">{SECONDARY[0].title}</h3>
          </div>
        </Link>
        <div className="grid grid-rows-2">
          {SECONDARY.slice(1).map(c => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden aspect-square lg:aspect-auto bg-[#eeece8]"
            >
              <Image
                src={c.img}
                alt={c.title}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-y-0 right-12 flex items-center">
                <h3 className="font-serif text-3xl text-white drop-shadow-lg">{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. POPULAR ITEMS */}
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

      {/* 5. BRANDS */}
      <section className="border-t border-neutral-100">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <h3 className="font-serif text-2xl text-center text-black mb-12">Naše značky</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 items-center justify-items-center text-black">
            {BRANDS.map(b => (
              <span key={b.name} className={`${b.className} hover:opacity-60 transition-opacity cursor-pointer`}>
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-24">
        <h2 className="font-serif text-3xl text-center text-black mb-14">Novinky</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-14">
          {products.slice(5, 10).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
