"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Accordion({
  items,
}: {
  items: { label: string; content: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-neutral-200">
      {items.map((item, i) => (
        <div key={i} className="border-b border-neutral-200">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${open === i ? "rotate-90" : ""}`}
            />
          </button>
          {open === i && (
            <div className="pb-5 text-sm text-neutral-600 leading-relaxed">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
