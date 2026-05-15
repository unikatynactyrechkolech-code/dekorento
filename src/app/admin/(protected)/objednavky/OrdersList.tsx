"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { OrderWithItems } from "./page";

const STATUSES: { value: string; label: string; color: string }[] = [
  { value: "pending", label: "Čeká", color: "bg-amber-100 text-amber-700" },
  { value: "paid", label: "Zaplaceno", color: "bg-blue-100 text-blue-700" },
  { value: "confirmed", label: "Potvrzeno", color: "bg-indigo-100 text-indigo-700" },
  { value: "shipped", label: "Odesláno", color: "bg-purple-100 text-purple-700" },
  { value: "completed", label: "Dokončeno", color: "bg-emerald-100 text-emerald-700" },
  { value: "cancelled", label: "Zrušeno", color: "bg-red-100 text-red-700" },
];

export default function OrdersList({ initial }: { initial: OrderWithItems[] }) {
  const [orders, setOrders] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);

  async function changeStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return alert("Chyba změny stavu");
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status: status as OrderWithItems["status"] } : x)));
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
        Žádné objednávky.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const isOpen = openId === o.id;
        const st = STATUSES.find((s) => s.value === o.status);
        return (
          <div key={o.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-4">
              <button
                onClick={() => setOpenId(isOpen ? null : o.id)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{o.order_number}</div>
                <div className="text-sm text-neutral-500 truncate">
                  {o.full_name} · {o.email} · {new Date(o.created_at).toLocaleString("cs-CZ")}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{o.total.toLocaleString("cs-CZ")} Kč</div>
                <div className="text-xs text-neutral-500">{o.order_items?.length ?? 0} položek</div>
              </div>
              <select
                value={o.status}
                onChange={(e) => changeStatus(o.id, e.target.value)}
                className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 ${st?.color}`}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            {isOpen && (
              <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-neutral-500 text-xs uppercase">Kontakt</div>
                    <div>{o.full_name}</div>
                    <div>{o.email}</div>
                    {o.phone && <div>{o.phone}</div>}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 text-xs uppercase">Adresa</div>
                    {o.street && <div>{o.street}</div>}
                    {(o.city || o.postal_code) && (
                      <div>
                        {o.postal_code} {o.city}
                      </div>
                    )}
                  </div>
                </div>
                {o.note && (
                  <div className="text-sm">
                    <div className="font-medium text-neutral-500 text-xs uppercase mb-1">Poznámka</div>
                    {o.note}
                  </div>
                )}
                <div>
                  <div className="font-medium text-neutral-500 text-xs uppercase mb-2">Položky</div>
                  <div className="space-y-1">
                    {o.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}× {item.product_name}
                        </span>
                        <span>{item.subtotal.toLocaleString("cs-CZ")} Kč</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
