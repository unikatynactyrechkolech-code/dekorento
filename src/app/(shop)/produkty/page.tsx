import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { dbGetProducts, dbGetCategories } from "@/lib/db-products";

export const metadata = { title: "Produkty — Dekorento" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const [products, categories] = await Promise.all([dbGetProducts(), dbGetCategories()]);
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-neutral-500">Načítání…</div>
      }
    >
      <ProductsClient products={products} categories={categories} />
    </Suspense>
  );
}
