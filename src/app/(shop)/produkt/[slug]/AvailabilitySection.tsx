"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";

export default function AvailabilitySection({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          <CalendarDays className="w-4 h-4" />
          Zkontrolovat dostupnost
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-neutral-200 px-5 py-5">
          <AvailabilityCalendar productId={productId} />
        </div>
      )}
    </div>
  );
}
