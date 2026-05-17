"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Reservation = { id: string; reserved_from: string; reserved_to: string };

const CZ_MONTHS = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
const CZ_DAYS = ["Po","Út","St","Čt","Pá","So","Ne"];

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function monthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = (first.getDay() + 6) % 7;
  const days: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

export default function AvailabilityCalendar({ productId }: { productId: string }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/availability?product_id=${productId}`)
      .then(r => r.json())
      .then(j => { setReservations(j.reservations ?? []); setLoading(false); });
  }, [productId]);

  function isReserved(d: Date) {
    const ds = isoDate(d);
    return reservations.some(r => ds >= r.reserved_from && ds <= r.reserved_to);
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const days = monthDays(year, month);

  if (loading) return (
    <div className="h-32 flex items-center justify-center text-sm text-neutral-400">Načítám dostupnost…</div>
  );

  return (
    <div className="border border-neutral-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-neutral-100 rounded-lg">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold">{CZ_MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-neutral-100 rounded-lg">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {CZ_DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-neutral-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const past = d < new Date(isoDate(today));
          const reserved = isReserved(d);
          const isToday = isoDate(d) === isoDate(today);

          let cls = "text-neutral-700";
          if (past) cls = "text-neutral-300";
          else if (reserved) cls = "bg-rose-50 text-rose-600 font-semibold";
          else cls = "bg-emerald-50 text-emerald-700";
          if (isToday) cls += " ring-1 ring-black";

          return (
            <div
              key={i}
              title={reserved ? "Obsazeno" : past ? "" : "Dostupné"}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs ${cls}`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-100 inline-block border border-emerald-200" />Dostupné
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-100 inline-block border border-rose-200" />Obsazeno
        </span>
      </div>
    </div>
  );
}
