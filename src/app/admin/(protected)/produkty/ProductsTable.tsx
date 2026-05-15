"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, X, Save } from "lucide-react";
import type { DbProduct } from "@/lib/supabase/types";

const empty: Partial<DbProduct> = {
  slug: "",
  name: "",
  description: "",
  price: 0,
  stock: 1,
  image: "",
  images: [],
  category: "",
  tags: [],
  badge: null,
  active: true,
};

export default function ProductsTable({ initial }: { initial: DbProduct[] }) {
  const [items, setItems] = useState<DbProduct[]>(initial);
  const [editing, setEditing] = useState<Partial<DbProduct> | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await fetch("/api/admin/products");
    const j = await r.json();
    setItems(j.products ?? []);
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    const isNew = !editing.id;
    const url = isNew ? "/api/admin/products" : `/api/admin/products/${editing.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert("Chyba: " + (j.error ?? res.statusText));
      return;
    }
    setEditing(null);
    refresh();
  }

  async function del(id: string) {
    if (!confirm("Opravdu smazat?")) return;
    const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!r.ok) return alert("Chyba mazání");
    refresh();
  }

  async function toggleActive(p: DbProduct) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    refresh();
  }

  return (
    <>
      <button
        onClick={() => setEditing({ ...empty })}
        className="bg-black text-white rounded-full px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Přidat produkt
      </button>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3">Název</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Sklad</th>
              <th className="px-4 py-3">Aktivní</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">
                  {p.image && (
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-neutral-100">
                      <Image src={p.image} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-neutral-500">{p.slug}</td>
                <td className="px-4 py-2">{p.price} Kč</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {p.active ? "ano" : "ne"}
                  </button>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => setEditing(p)} className="p-2 hover:bg-neutral-100 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(p.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-neutral-400 py-12">
                  Žádné produkty. Klikni na &quot;Importovat produkty z JSON&quot; v přehledu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductModal
          value={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
          busy={busy}
        />
      )}
    </>
  );
}

function ProductModal({
  value,
  onChange,
  onClose,
  onSave,
  busy,
}: {
  value: Partial<DbProduct>;
  onChange: (v: Partial<DbProduct>) => void;
  onClose: () => void;
  onSave: () => void;
  busy: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const sigRes = await fetch("/api/admin/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Chybí Cloudinary konfigurace");
      const { cloudName, apiKey, timestamp, folder, signature } = await sigRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("folder", folder);
      fd.append("signature", signature);

      const r = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? "upload error");
      const url: string = j.secure_url;
      onChange({
        ...value,
        image: value.image || url,
        images: [...(value.images ?? []), url],
      });
    } catch (e) {
      alert("Upload selhal: " + (e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">{value.id ? "Upravit produkt" : "Nový produkt"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Název">
            <input
              className="input"
              value={value.name ?? ""}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              className="input"
              value={value.slug ?? ""}
              onChange={(e) => onChange({ ...value, slug: e.target.value })}
            />
          </Field>
          <Field label="Popis">
            <textarea
              className="input min-h-24"
              value={value.description ?? ""}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Cena (Kč)">
              <input
                type="number"
                className="input"
                value={value.price ?? 0}
                onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
              />
            </Field>
            <Field label="Sklad (ks)">
              <input
                type="number"
                className="input"
                value={value.stock ?? 0}
                onChange={(e) => onChange({ ...value, stock: Number(e.target.value) })}
              />
            </Field>
            <Field label="Štítek">
              <input
                className="input"
                placeholder="Bestseller…"
                value={value.badge ?? ""}
                onChange={(e) => onChange({ ...value, badge: e.target.value || null })}
              />
            </Field>
          </div>
          <Field label="Kategorie">
            <input
              className="input"
              value={value.category ?? ""}
              onChange={(e) => onChange({ ...value, category: e.target.value })}
            />
          </Field>
          <Field label="Hlavní obrázek (URL)">
            <input
              className="input"
              value={value.image ?? ""}
              onChange={(e) => onChange({ ...value, image: e.target.value })}
            />
          </Field>
          <Field label="Galerie obrázků (čárkou oddělené URL)">
            <textarea
              className="input min-h-20"
              value={(value.images ?? []).join(",\n")}
              onChange={(e) =>
                onChange({
                  ...value,
                  images: e.target.value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </Field>

          <div>
            <label className="block text-sm font-medium mb-1.5">Nahrát obrázek (Cloudinary)</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f);
              }}
              className="text-sm"
            />
            {uploading && <p className="text-sm text-neutral-500 mt-1">Nahrávám…</p>}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.active ?? true}
              onChange={(e) => onChange({ ...value, active: e.target.checked })}
            />
            <span className="text-sm">Aktivní (zobrazit v e-shopu)</span>
          </label>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full hover:bg-neutral-100">
            Zrušit
          </button>
          <button
            onClick={onSave}
            disabled={busy}
            className="bg-black text-white rounded-full px-5 py-2.5 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {busy ? "Ukládám…" : "Uložit"}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid rgb(212 212 212);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: black;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
