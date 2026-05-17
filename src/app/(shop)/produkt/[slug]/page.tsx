import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { dbGetProduct, dbGetProducts } from "@/lib/db-products";
import { formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "./AddToCartButton";
import ProductGallery from "./ProductGallery";
import Accordion from "./Accordion";
import AvailabilitySection from "./AvailabilitySection";

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
  // Hlavní obrázek vždy jako první, pak galerie bez duplikátů
  const gallery = [
    ...(product.image ? [product.image] : []),
    ...(product.images ?? []).filter((u) => u !== product.image),
  ];

  // Sestavení detailních řádků — jen ty co mají hodnotu
  const details: { label: string; value: string }[] = [
    product.material ? { label: "Materiál", value: product.material } : null,
    product.size ? { label: "Rozměr", value: product.size } : null,
    product.stojan ? { label: "Stojan / Konstrukce", value: product.stojan } : null,
    product.doprava ? { label: "Doprava", value: product.doprava } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // Video ID z YouTube/Vimeo URL
  function getYouTubeId(url: string) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return m?.[1] ?? null;
  }
  function getVimeoId(url: string) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m?.[1] ?? null;
  }

  const accordionItems = [
    {
      label: "Popis",
      content: <p>{product.description}</p>,
    },
    ...(details.length > 0
      ? [{
          label: "Parametry",
          content: (
            <div className="space-y-3">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between">
                  <span className="text-neutral-500">{d.label}</span>
                  <span className="font-medium text-neutral-900 text-right">{d.value}</span>
                </div>
              ))}
            </div>
          ),
        }]
      : []),
    ...(product.video_url
      ? [{
          label: "Video manuál",
          content: (() => {
            const ytId = getYouTubeId(product.video_url!);
            const vimeoId = getVimeoId(product.video_url!);
            if (ytId) return (
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
            if (vimeoId) return (
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
            return <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="underline">Otevřít video</a>;
          })(),
        }]
      : []),
    {
      label: "Doprava a vrácení",
      content: (
        <div className="space-y-2">
          <p>Doručujeme v rámci Prahy a okolí. Pro celou ČR po dohodě.</p>
          <p>Pronájem je vždy na dohodnutý počet dní. Záloha je vratná po vrácení v pořádku.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/produkty" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4" /> Zpět na katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Galerie s výběrem */}
        <ProductGallery images={gallery} name={product.name} badge={product.badge} />

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

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-neutral-100 text-xs uppercase tracking-wider font-medium">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <AddToCartButton product={product} />
            <AvailabilitySection productId={product.id} />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div className="mt-8">
            <Accordion items={accordionItems} />
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
