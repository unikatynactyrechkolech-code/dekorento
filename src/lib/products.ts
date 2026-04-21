import raw from "@/data/products.json";
import type { Product } from "./types";

type Raw = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  images: string[];
};

function deriveCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("glitter") || n.includes("flitr")) return "Glitter & Flitry";
  if (n.includes("třásn") || n.includes("trasn") || n.includes("stuh")) return "Třásně & Stuhy";
  if (n.includes("látkov") || n.includes("latkov") || n.includes("saténov") || n.includes("semišov")) return "Látková pozadí";
  return "Tematická pozadí";
}

function deriveTags(name: string): string[] {
  const n = name.toLowerCase();
  const tags: string[] = [];
  if (n.includes("svateb") || n.includes("růže") || n.includes("ruze") || n.includes("květ") || n.includes("kvet") || n.includes("bíl") || n.includes("bil")) tags.push("svatba");
  if (n.includes("glitter") || n.includes("flitr") || n.includes("party") || n.includes("rose") || n.includes("gold") || n.includes("třásn") || n.includes("trasn") || n.includes("stuh")) tags.push("párty");
  if (n.includes("vesmír") || n.includes("vesmir") || n.includes("hawai") || n.includes("hvězd") || n.includes("hvezd") || n.includes("zámeck") || n.includes("zameck") || n.includes("plíšk") || n.includes("plisk")) tags.push("fotokoutek");
  if (tags.length === 0) tags.push("párty");
  return tags;
}

const palette: Record<string, string> = {
  "cervene": "ohnivá červená",
  "cerne": "elegantní černá",
  "modre": "královská modrá",
  "ruzove": "romantická růžová",
  "rose": "rose gold",
  "bile": "čistě bílá",
  "fialov": "královská fialová",
  "gold": "luxusní zlatá",
  "stribrne": "perlově stříbrná",
  "champagne": "šampaňská",
  "kremov": "krémová",
  "merunkov": "meruňková",
  "duhov": "duhová",
};

function deriveDescription(p: Raw): string {
  const lower = p.slug;
  let color = "";
  for (const [k, v] of Object.entries(palette)) {
    if (lower.includes(k)) { color = v; break; }
  }
  const intro = color
    ? `Ručně vyrobené prémiové pozadí v ${color} barvě, které promění každou událost v nezapomenutelný zážitek.`
    : `Originální designové pozadí, které dodá vaší události punc luxusu a jedinečnosti.`;
  return `${intro} Ideální pro svatby, večírky, narozeniny, focení i firemní akce. Velikost cca 2,4 × 2,4 m, snadná instalace, dodáváme včetně stojanu po dohodě. Cena je za jeden den zapůjčení vč. čištění.`;
}

const enriched: Product[] = (raw as Raw[]).map((p, i) => ({
  ...p,
  category: deriveCategory(p.name),
  tags: deriveTags(p.name),
  description: deriveDescription(p),
  badge: i < 4 ? "Bestseller" : i % 9 === 0 ? "Novinka" : undefined,
}));

export const products: Product[] = enriched;

export const categories = Array.from(new Set(products.map(p => p.category)));

export function getProduct(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function searchProducts(q: string): Product[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return products.filter(p =>
    p.name.toLowerCase().includes(s) ||
    p.category.toLowerCase().includes(s) ||
    p.tags.some(t => t.toLowerCase().includes(s))
  ).slice(0, 8);
}
