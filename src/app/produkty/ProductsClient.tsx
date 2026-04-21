"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

export default function ProductsClient() {
  const sp = useSearchParams();
  const initialCat = sp.get("cat") || "";
  const initialQ = sp.get("q") || "";

  const [cat, setCat] = useState(initialCat);
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("popular");
  const [q] = useState(initialQ);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allTags = useMemo(
    () => Array.from(new Set(products.flatMap(p => p.tags))),
    []
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat) list = list.filter(p => p.category === cat);
    if (tag) list = list.filter(p => p.tags.includes(tag));
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s));
    }
    if (maxPrice) list = list.filter(p => p.price <= maxPrice);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "cs"));
    return list;
  }, [cat, tag, q, sort, maxPrice]);

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">Kategorie</h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setCat("")}
            className={`text-left text-sm py-1.5 ${!cat ? "font-semibold" : "text-neutral-600 hover:text-black"}`}
          >
            Vše
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-left text-sm py-1.5 ${cat === c ? "font-semibold" : "text-neutral-600 hover:text-black"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">Vhodné pro</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTag("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              !tag ? "bg-black text-white border-black" : "border-neutral-200 hover:border-black"
            }`}
          >
            Vše
          </button>
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize ${
                tag === t ? "bg-black text-white border-black" : "border-neutral-200 hover:border-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">Cena / den</h3>
        <div className="flex flex-col gap-1.5">
          {[null, 1000, 1500, 2000].map((p, i) => (
            <button
              key={i}
              onClick={() => setMaxPrice(p)}
              className={`text-left text-sm py-1.5 ${maxPrice === p ? "font-semibold" : "text-neutral-600 hover:text-black"}`}
            >
              {p === null ? "Vše" : `do ${p.toLocaleString("cs-CZ")} Kč`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">
          Katalog
        </p>
        <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight">
          {cat || "Všechny produkty"}
        </h1>
        <p className="mt-3 text-neutral-500">{filtered.length} produktů</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block">{Filters}</aside>

        <div>
          <div className="flex items-center justify-between mb-6 gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-full text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtry
            </button>
            <div className="ml-auto">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-4 py-2 border border-neutral-200 rounded-full text-sm bg-white focus:outline-none focus:border-black"
              >
                <option value="popular">Nejoblíbenější</option>
                <option value="price-asc">Cena: nejnižší</option>
                <option value="price-desc">Cena: nejvyšší</option>
                <option value="name">Název A–Z</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-lg font-medium">Žádné produkty</p>
              <p className="text-sm text-neutral-500 mt-1">Zkuste upravit filtry</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold">Filtry</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            {Filters}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full bg-black text-white py-3 rounded-full font-semibold"
            >
              Zobrazit ({filtered.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
