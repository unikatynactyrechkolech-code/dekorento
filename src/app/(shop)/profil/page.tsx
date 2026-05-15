"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Package } from "lucide-react";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  subtotal: number;
};
type Order = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Čeká na zpracování",
  paid: "Zaplaceno",
  confirmed: "Potvrzeno",
  shipped: "Odesláno",
  completed: "Dokončeno",
  cancelled: "Zrušeno",
};

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/prihlaseni");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((j) => setOrders(j.orders ?? []))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (loading || !user) {
    return <div className="mx-auto max-w-md px-4 py-24 text-center text-neutral-500">Načítání…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 text-white flex items-center justify-center text-2xl font-bold">
          {user.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ahoj, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-neutral-500">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-full text-sm font-medium hover:bg-neutral-50"
        >
          <LogOut className="w-4 h-4" /> Odhlásit
        </button>
      </div>

      <div className="mt-12">
        <h2 className="font-bold text-2xl flex items-center gap-3">
          <Package className="w-6 h-6" /> Vaše objednávky
        </h2>

        {loadingOrders ? (
          <p className="mt-4 text-neutral-500">Načítání…</p>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-100 p-8 text-center">
            <p className="text-neutral-500">Zatím nemáte žádné objednávky.</p>
            <Link
              href="/produkty"
              className="inline-flex mt-4 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold"
            >
              Prohlédnout katalog
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-neutral-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold">{o.order_number}</div>
                    <div className="text-sm text-neutral-500">
                      {new Date(o.created_at).toLocaleString("cs-CZ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{o.total.toLocaleString("cs-CZ")} Kč</div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-neutral-600 space-y-0.5">
                  {o.order_items?.map((item) => (
                    <div key={item.id}>
                      {item.quantity}× {item.product_name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
