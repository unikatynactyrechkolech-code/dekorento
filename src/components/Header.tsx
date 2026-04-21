"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchOverlay from "./SearchOverlay";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/produkty", label: "Shop" },
  { href: "/inspirace", label: "Inspirace" },
  { href: "/profil", label: "Účet" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex items-center h-20 gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <span className="font-serif text-3xl italic font-medium tracking-tight text-black border-b-2 border-black pb-0.5 leading-none">
                dekorento
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-8 text-[15px] text-black">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="hover:opacity-60 transition-opacity"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-5 ml-auto text-black">
              <Link
                href="/kosik"
                className="hidden sm:inline text-[15px] hover:opacity-60"
              >
                Košík ({count})
              </Link>
              <button
                onClick={() => setSearchOpen(true)}
                className="hover:opacity-60"
                aria-label="Hledat"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </button>
              <button className="hidden sm:inline hover:opacity-60" aria-label="Jazyk">
                <Globe className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </button>
              <Link
                href={user ? "/profil" : "/prihlaseni"}
                className="hover:opacity-60 relative"
                aria-label="Účet"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </Link>
              <button
                onClick={() => setOpen(true)}
                className="sm:hidden hover:opacity-60 relative"
                aria-label="Košík"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                    {count}
                  </span>
                )}
              </button>
              <button
                className="lg:hidden hover:opacity-60"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif text-2xl italic">dekorento</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base text-black hover:opacity-60"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
