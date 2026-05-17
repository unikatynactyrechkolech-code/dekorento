"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, X, Save, ChevronLeft, ChevronRight } from "lucide-react";
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

// Převede název na slug: "Béžové pozadí 2×2" → "bezove-pozadi-2x2"
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function UploadZone({
  onFiles,
  uploading,
  dragLabel,
}: {
  onFiles: (f: FileList | File[]) => void;
  uploading: number;
  dragLabel?: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <label
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-6 px-4 cursor-pointer transition-colors ${
        dragOver ? "border-black bg-neutral-50" : "border-neutral-300 hover:border-neutral-500"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
    >
      <input type="file" accept="image/*" multiple className="sr-only"
        onChange={(e) => e.target.files && onFiles(e.target.files)} />
      {uploading > 0 ? (
        <p className="text-sm text-neutral-500">Nahrávám {uploading} {uploading === 1 ? "soubor" : "soubory"}…</p>
      ) : (
        <>
          <p className="text-sm font-medium">{dragLabel ?? "Přetáhni sem nebo klikni pro výběr"}</p>
          <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WEBP</p>
        </>
      )}
    </label>
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
  const [tab, setTab] = useState<"info" | "obrazky" | "dostupnost">("info");
  const [uploadingMain, setUploadingMain] = useState(0);
  const [uploadingGallery, setUploadingGallery] = useState(0);
  const [slugEdited, setSlugEdited] = useState(!!value.id);

  async function doUpload(
    files: FileList | File[],
    setProgress: (fn: (n: number) => number) => void,
    mode: "main" | "gallery"
  ) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    setProgress((n) => n + arr.length);
    let updated = { ...value };
    for (const file of arr) {
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
        const r = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error?.message ?? "upload error");
        const url: string = j.secure_url;
        if (mode === "main") {
          updated = { ...updated, image: url };
        } else {
          const imgs = [...(updated.images ?? []).filter((u) => u !== url), url];
          updated = { ...updated, images: imgs };
        }
      } catch (e) {
        alert("Upload selhal: " + (e as Error).message);
      } finally {
        setProgress((n) => n - 1);
      }
    }
    onChange(updated);
  }

  function removeGalleryImage(url: string) {
    const imgs = (value.images ?? []).filter((u) => u !== url);
    onChange({ ...value, images: imgs });
  }

  function handleNameChange(name: string) {
    if (!slugEdited) {
      onChange({ ...value, name, slug: toSlug(name) });
    } else {
      onChange({ ...value, name });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg">{value.id ? "Upravit produkt" : "Nový produkt"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 shrink-0 px-6">
          {(["info", "obrazky", "dostupnost"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"
              }`}
            >
              {t === "info" ? "Informace" : t === "obrazky" ? "Obrázky" : "Dostupnost"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {tab === "info" && (
            <>
              <Field label="Název produktu">
                <input className="input" placeholder="např. Béžové plátěné pozadí"
                  value={value.name ?? ""}
                  onChange={(e) => handleNameChange(e.target.value)} />
              </Field>
              <Field label="Adresa (slug)">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 whitespace-nowrap">/produkt/</span>
                  <input className="input flex-1" placeholder="bezove-platene-pozadi"
                    value={value.slug ?? ""}
                    onChange={(e) => { setSlugEdited(true); onChange({ ...value, slug: e.target.value }); }} />
                </div>
                <p className="text-xs text-neutral-400 mt-1">Vyplní se automaticky z názvu, ale jde přepsat</p>
              </Field>
              <Field label="Popis">
                <textarea className="input min-h-24" placeholder="Stručný popis produktu — materiál, použití, rozměry…"
                  value={value.description ?? ""}
                  onChange={(e) => onChange({ ...value, description: e.target.value })} />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Cena (Kč / den)">
                  <input type="number" className="input" placeholder="890"
                    value={value.price ?? ""}
                    onChange={(e) => onChange({ ...value, price: Number(e.target.value) })} />
                </Field>
                <Field label="Sklad (ks)">
                  <input type="number" className="input" placeholder="1"
                    value={value.stock ?? ""}
                    onChange={(e) => onChange({ ...value, stock: Number(e.target.value) })} />
                </Field>
                <Field label="Štítek">
                  <input className="input" placeholder="Bestseller"
                    value={value.badge ?? ""}
                    onChange={(e) => onChange({ ...value, badge: e.target.value || null })} />
                </Field>
              </div>
              <Field label="Kategorie">
                <input className="input" placeholder="např. Látková pozadí"
                  value={value.category ?? ""}
                  onChange={(e) => onChange({ ...value, category: e.target.value })} />
              </Field>
              <div className="border border-neutral-200 rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold">Detailní informace</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Materiál">
                    <input className="input" placeholder="např. 100% polyester"
                      value={(value as Record<string, string>).material ?? ""}
                      onChange={(e) => onChange({ ...value, material: e.target.value } as Partial<DbProduct>)} />
                  </Field>
                  <Field label="Rozměr">
                    <input className="input" placeholder="např. 2,4 × 2,4 m"
                      value={value.size ?? ""}
                      onChange={(e) => onChange({ ...value, size: e.target.value })} />
                  </Field>
                  <Field label="Stojan / Konstrukce">
                    <input className="input" placeholder="např. Volitelně za 500 Kč"
                      value={(value as Record<string, string>).stojan ?? ""}
                      onChange={(e) => onChange({ ...value, stojan: e.target.value } as Partial<DbProduct>)} />
                  </Field>
                  <Field label="Doprava">
                    <input className="input" placeholder="Praha + okolí, ČR po dohodě"
                      value={(value as Record<string, string>).doprava ?? ""}
                      onChange={(e) => onChange({ ...value, doprava: e.target.value } as Partial<DbProduct>)} />
                  </Field>
                </div>
                <Field label="Video manuál (YouTube/Vimeo URL)">
                  <input className="input" placeholder="https://www.youtube.com/watch?v=…"
                    value={value.video_url ?? ""}
                    onChange={(e) => onChange({ ...value, video_url: e.target.value })} />
                </Field>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={value.active ?? true}
                  onChange={(e) => onChange({ ...value, active: e.target.checked })} />
                <span className="text-sm">Aktivní (zobrazit v e-shopu)</span>
              </label>
            </>
          )}

          {tab === "obrazky" && (
            <>
              <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Hlavní obrázek</span>
                  <span className="text-xs text-neutral-400">— náhled v katalogu</span>
                </div>
                {value.image ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                      <Image src={value.image} alt="" fill className="object-cover" sizes="112px" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-500 break-all">{value.image.split("/").pop()}</p>
                      <button onClick={() => onChange({ ...value, image: "" })}
                        className="text-xs text-red-600 hover:underline">Odebrat</button>
                    </div>
                  </div>
                ) : (
                  <UploadZone onFiles={(f) => doUpload(f, setUploadingMain, "main")}
                    uploading={uploadingMain} dragLabel="Nahrát hlavní obrázek" />
                )}
              </div>

              <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Galerie</span>
                  <span className="text-xs text-neutral-400">— další fotky produktu</span>
                </div>
                {(value.images ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {(value.images ?? []).map((url) => (
                      <div key={url} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-neutral-200">
                        <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button onClick={() => removeGalleryImage(url)}
                            className="text-white text-[10px] bg-red-600/80 rounded px-1.5 py-0.5 hover:bg-red-600">
                            Odebrat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <UploadZone onFiles={(f) => doUpload(f, setUploadingGallery, "gallery")}
                  uploading={uploadingGallery} dragLabel="Přetáhni více fotek nebo klikni" />
              </div>
            </>
          )}

          {tab === "dostupnost" && (
            <ReservationTab productId={value.id} />
          )}
        </div>

        {/* Footer — jen na info/obrazky tabech */}
        {tab !== "dostupnost" && (
          <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3 shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 rounded-full hover:bg-neutral-100">Zrušit</button>
            <button onClick={onSave} disabled={busy}
              className="bg-black text-white rounded-full px-5 py-2.5 inline-flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {busy ? "Ukládám…" : "Uložit"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid rgb(212 212 212);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
        }
        :global(.input:focus) { outline: none; border-color: black; }
      `}</style>
    </div>
  );
}
function ReservationTab({ productId }: { productId?: string }) {
  const [reservations, setReservations] = useState<{ id: string; reserved_from: string; reserved_to: string; note: string | null }[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [selecting, setSelecting] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/reservations?product_id=${productId}`);
    const data = await res.json();
    setReservations(data.reservations ?? []);
    setLoading(false);
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  if (!productId) {
    return <p className="text-sm text-neutral-500 text-center py-8">Nejdříve uložte produkt, pak ho znovu otevřete pro správu dostupnosti.</p>;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first

  const reservedDates = new Set<string>();
  reservations.forEach((r) => {
    const d = new Date(r.reserved_from);
    const end = new Date(r.reserved_to);
    while (d <= end) {
      reservedDates.add(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
  });

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;

  const handleDayClick = (d: number) => {
    const ds = dateStr(d);
    if (!selecting.from || (selecting.from && selecting.to)) {
      setSelecting({ from: ds, to: null });
    } else {
      const from = selecting.from!;
      setSelecting({ from: from < ds ? from : ds, to: from < ds ? ds : from });
    }
  };

  const isInRange = (d: number) => {
    const ds = dateStr(d);
    if (selecting.from && selecting.to) return ds >= selecting.from && ds <= selecting.to;
    return ds === selecting.from;
  };

  const monthNames = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
  const dayLabels = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const saveReservation = async () => {
    if (!selecting.from || !selecting.to) return;
    setSaving(true);
    await fetch("/api/admin/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, reserved_from: selecting.from, reserved_to: selecting.to, note }),
    });
    setSelecting({ from: null, to: null });
    setNote("");
    await load();
    setSaving(false);
  };

  const deleteReservation = async (id: string) => {
    if (!confirm("Smazat rezervaci?")) return;
    await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-neutral-100"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-neutral-100"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {dayLabels.map(l => <div key={l} className="text-[10px] font-semibold text-neutral-400">{l}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const ds = dateStr(d);
            const reserved = reservedDates.has(ds);
            const inRange = isInRange(d);
            return (
              <button key={d} onClick={() => handleDayClick(d)}
                className={`aspect-square rounded-lg text-xs font-medium transition-colors ${
                  reserved ? "bg-red-100 text-red-700 hover:bg-red-200" :
                  inRange ? "bg-black text-white" :
                  "hover:bg-neutral-100"
                }`}>
                {d}
              </button>
            );
          })}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-neutral-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" />Obsazeno</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-black inline-block" />Vybráno</span>
        </div>
      </div>

      {/* New reservation */}
      {selecting.from && (
        <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold">Nová rezervace</p>
          <p className="text-xs text-neutral-500">
            {selecting.from} {selecting.to && selecting.to !== selecting.from ? `→ ${selecting.to}` : "— vyberte konec"}
          </p>
          {selecting.to && (
            <>
              <input className="input" placeholder="Poznámka (volitelné)"
                value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={saveReservation} disabled={saving}
                  className="bg-black text-white text-sm px-4 py-2 rounded-full disabled:opacity-50">
                  {saving ? "Ukládám…" : "Uložit rezervaci"}
                </button>
                <button onClick={() => setSelecting({ from: null, to: null })}
                  className="text-sm px-4 py-2 rounded-full hover:bg-neutral-100">Zrušit</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Existing reservations */}
      <div>
        <p className="text-sm font-semibold mb-2">Rezervace</p>
        {loading ? <p className="text-xs text-neutral-400">Načítám…</p> : reservations.length === 0 ? (
          <p className="text-xs text-neutral-400">Žádné rezervace</p>
        ) : (
          <div className="space-y-2">
            {reservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2">
                <div>
                  <p className="text-xs font-medium">{r.reserved_from} → {r.reserved_to}</p>
                  {r.note && <p className="text-xs text-neutral-500">{r.note}</p>}
                </div>
                <button onClick={() => deleteReservation(r.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
