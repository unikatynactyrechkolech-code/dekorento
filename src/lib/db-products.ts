import "server-only";
import { createSupabaseServer, createSupabaseAdmin } from "./supabase/server";
import type { Product } from "./types";
import type { DbProduct } from "./supabase/types";

function dbToProduct(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image ?? "",
    images: p.images ?? [],
    category: p.category ?? "",
    tags: p.tags ?? [],
    description: p.description ?? "",
    badge: p.badge ?? undefined,
    material: p.material ?? undefined,
    size: p.size ?? undefined,
    stojan: p.stojan ?? undefined,
    doprava: p.doprava ?? undefined,
    video_url: p.video_url ?? undefined,
    requires_construction: p.requires_construction,
    construction_price: p.construction_price,
  };
}

export async function dbGetProducts(): Promise<Product[]> {
  const sb = await createSupabaseServer();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("dbGetProducts:", error);
    return [];
  }
  return (data as DbProduct[]).map(dbToProduct);
}

export async function dbGetProduct(slug: string): Promise<Product | null> {
  const sb = await createSupabaseServer();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return null;
  return dbToProduct(data as DbProduct);
}

export async function dbGetCategories(): Promise<string[]> {
  const sb = await createSupabaseServer();
  const { data } = await sb.from("products").select("category").eq("active", true);
  if (!data) return [];
  return Array.from(new Set(data.map((d) => d.category).filter(Boolean) as string[]));
}

export async function dbAdminListProducts(): Promise<DbProduct[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as DbProduct[];
}
