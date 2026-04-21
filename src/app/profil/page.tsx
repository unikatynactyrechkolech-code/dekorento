"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Heart, Package, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      const t = setTimeout(() => {
        if (!localStorage.getItem("dekorento_user_v1")) router.push("/prihlaseni");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-neutral-500">
        Načítání…
      </div>
    );
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
        <Card icon={Package} title="Objednávky" desc="0 aktivních" href="#" />
        <Card icon={Heart} title="Oblíbené" desc="Vaše uložené" href="#" />
        <Card icon={Settings} title="Nastavení" desc="Adresa & kontakt" href="#" />
      </div>

      <div className="mt-10 rounded-2xl border border-neutral-100 p-8">
        <h2 className="font-bold text-lg">Vaše objednávky</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Zatím tu nic není. Po dokončení první objednávky se zobrazí přehled.
        </p>
        <Link
          href="/produkty"
          className="inline-flex mt-4 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold"
        >
          Prohlédnout katalog
        </Link>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-neutral-100 hover:border-black p-6 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-neutral-500">{desc}</div>
    </Link>
  );
}
