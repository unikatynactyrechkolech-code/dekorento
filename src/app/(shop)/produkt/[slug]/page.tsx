import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { dbGetProduct, dbGetProducts } from "@/lib/db-products";
import { formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await dbGetProduct(slug);
  if (!p) return { title: "Produkt nenalezen" };
  return { title: `${p.name} — Dekorento` };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await dbGetProduct(slug);
  if (!product) notFound();

  const all = await dbGetProducts();
  const related = all.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const gallery = product.images.length ? product.images : [product.image];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/produkty" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4" /> Zpět na katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={gallery[0]}
              alt={product.name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((g, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                  <Image src={g} alt="" fill sizes="200px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:py-4">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            <span className="text-sm text-neutral-500">/ 1 den pronájmu</span>
          </div>

          <p className="mt-6 text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-neutral-100 text-xs uppercase tracking-wider font-medium">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, t: "Doprava Praha", d: "Zdarma od 2 000 Kč" },
              { icon: ShieldCheck, t: "Bezpečné pronájmy", d: "Vratná záloha" },
              { icon: Sparkles, t: "Vyčištěno", d: "Vždy jako nové" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-neutral-100">
                <f.icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold">{f.t}</div>
                  <div className="text-xs text-neutral-500">{f.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-neutral-100 pt-8 space-y-5">
            <Detail label="Materiál" value="Prémiové textilie a třpytky" />
            <Detail label="Rozměr" value="cca 2,4 × 2,4 m" />
            <Detail label="Stojan" value="Volitelně, po dohodě" />
            <Detail label="Doprava" value="Praha + okolí, ČR po dohodě" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-8">
            Mohlo by se líbit
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}
