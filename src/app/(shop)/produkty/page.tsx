import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata = { title: "Produkty — Dekorento" };

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-neutral-500">Načítání…</div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
