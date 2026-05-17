"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Trash2, Plus, X } from "lucide-react";

type Product = { id: string; name: string; slug: string; category: string | null };
type Reservation = { id: string; reserved_from: string; reserved_to: string; note?: string };

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function monthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = (first.getDay() + 6) % 7; // Monday = 0
  const days: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function dateInRange(d: Date, from: string, to: string) {
  const ds = isoDate(d);
  return ds >= from && ds <= to;
}

const CZ_MONTHS = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
const CZ_DAYS = ["Po","Út","St","Čt","Pá","So","Ne"];

export default function KalendarClient({ products }: { products: Product[] }) {
  const today = new Date();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selecting, setSelecting] = useState<{ from: string } | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingRange, setPendingRange] = useState<{ from: string; to: string } | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!productId) return;
    const r = await fetch(`/api/admin/reservations?product_id=${productId}`);
    const j = await r.json();
    setReservations(j.reservations ?? []);
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function getReservationForDate(d: Date): Reservation | null {
    const ds = isoDate(d);
    return reservations.find(r => ds >= r.reserved_from && ds <= r.reserved_to) ?? null;
  }

  function isSelecting(d: Date) {
    if (!selecting || !hoverDate) return false;
    const ds = isoDate(d);
    const [a, b] = selecting.from <= hoverDate
      ? [selecting.from, hoverDate]
      : [hoverDate, selecting.from];
    return ds >= a && ds <= b;
  }

  function handleDayClick(d: Date) {
    const ds = isoDate(d);
    if (!selecting) {
      setSelecting({ from: ds });
    } else {
      const [from, to] = selecting.from <= ds ? [selecting.from, ds] : [ds, selecting.from];
      setPendingRange({ from, to });
      setSelecting(null);
      setHoverDate(null);
      setNote("");
      setShowModal(true);
    }
  }

  async function saveReservation() {
    if (!pendingRange || !productId) return;
    setSaving(true);
    const r = await fetch("/api/admin/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, reserved_from: pendingRange.from, reserved_to: pendingRange.to, note }),
    });
    setSaving(false);
    if (!r.ok) { alert("Chyba při ukládání"); return; }
    setShowModal(false);
    setPendingRange(null);
    load();
  }

  async function deleteReservation(id: string) {
    if (!confirm("Smazat rezervaci?")) return;
    await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
    load();
  }

  const days = monthDays(year, month);
  const selectedProduct = products.find(p => p.id === productId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black">Kalendář rezervací</h1>
          <p className="text-sm text-neutral-500 mt-1">Klikni na první den → pak na poslední den → ulož rezervaci</p>
        </div>
      </div>

      {/* Výběr produktu */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <label className="block text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-2">Produkt</label>
        <select
          value={productId}
          onChange={e => setProductId(e.target.value)}
          className="w-full sm:w-80 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}{p.category ? ` — ${p.category}` : ""}</option>
          ))}
        </select>
        {selectedProduct && (
          <p className="text-xs text-neutral-400 mt-1.5">/produkt/{selectedProduct.slug}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Kalendář */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          {/* Navigace */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-neutral-100 rounded-xl">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg">{CZ_MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-neutral-100 rounded-xl">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dny týdne */}
          <div className="grid grid-cols-7 mb-2">
            {CZ_DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-neutral-400 py-1">{d}</div>
            ))}
          </div>

          {/* Dny */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const ds = isoDate(d);
              const res = getReservationForDate(d);
              const isPast = d < new Date(isoDate(today));
              const isToday = ds === isoDate(today);
              const inSelect = isSelecting(d);
              const isStart = selecting?.from === ds;

              let bg = "hover:bg-neutral-100";
              if (res) bg = "bg-rose-100 text-rose-800 hover:bg-rose-200";
              else if (inSelect || isStart) bg = "bg-blue-100 text-blue-800";
              else if (isToday) bg = "ring-2 ring-black";

              return (
                <button
                  key={i}
                  onClick={() => !isPast && handleDayClick(d)}
                  onMouseEnter={() => selecting && setHoverDate(ds)}
                  onMouseLeave={() => selecting && setHoverDate(null)}
                  disabled={isPast}
                  title={res ? (res.note || "Rezervováno") : ""}
                  className={`relative aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${bg} ${isPast ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {d.getDate()}
                  {res && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex gap-4 mt-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-200 inline-block" />Rezervováno</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200 inline-block" />Výběr</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border-2 border-black inline-block" />Dnes</span>
          </div>

          {selecting && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 text-sm">
              <span>Vybráno od: <strong>{selecting.from}</strong> — klikni na koncový den</span>
              <button onClick={() => { setSelecting(null); setHoverDate(null); }} className="text-neutral-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Seznam rezervací */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-500">Rezervace produktu</h3>
          {reservations.length === 0 ? (
            <p className="text-sm text-neutral-400 py-4 text-center">Žádné rezervace</p>
          ) : (
            <div className="space-y-2">
              {reservations.map(r => (
                <div key={r.id} className="flex items-start justify-between gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div>
                    <p className="text-sm font-semibold">{r.reserved_from} → {r.reserved_to}</p>
                    {r.note && <p className="text-xs text-neutral-500 mt-0.5">{r.note}</p>}
                  </div>
                  <button
                    onClick={() => deleteReservation(r.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setPendingRange(null); setNote(""); setShowModal(true); }}
            className="w-full mt-2 border border-dashed border-neutral-300 rounded-xl py-2.5 text-sm text-neutral-500 hover:border-black hover:text-black flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Přidat ručně
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Nová rezervace</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">Od</label>
                <input
                  type="date"
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black"
                  value={pendingRange?.from ?? ""}
                  onChange={e => setPendingRange(p => p ? { ...p, from: e.target.value } : { from: e.target.value, to: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">Do</label>
                <input
                  type="date"
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black"
                  value={pendingRange?.to ?? ""}
                  onChange={e => setPendingRange(p => p ? { ...p, to: e.target.value } : { from: e.target.value, to: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 mb-1 block">Poznámka (nepovinná)</label>
              <input
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black"
                placeholder="např. Novák — firemní akce"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { setShowModal(false); setPendingRange(null); }} className="px-5 py-2.5 rounded-full hover:bg-neutral-100 text-sm">
                Zrušit
              </button>
              <button
                onClick={saveReservation}
                disabled={saving || !pendingRange?.from || !pendingRange?.to}
                className="bg-black text-white px-5 py-2.5 rounded-full text-sm disabled:opacity-50"
              >
                {saving ? "Ukládám…" : "Uložit rezervaci"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
