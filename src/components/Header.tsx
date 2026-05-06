"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchOverlay from "./SearchOverlay";

// Halena-style language icon (文A)
const LangIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h8M9 5v3M7 13c.6 1.4 1.8 2.5 3 3M6 16c1-1 2-2 3-3" />
    <path d="M13 6h6m-3-3v3" />
    <path d="M14 21l4-9 4 9M15.5 17.5h5" />
  </svg>
);

// User circle icon (Halena style)
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// 3 stacked dots (•••) as mobile menu trigger
const DotsMenu = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="4" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="10" cy="16" r="1.5" />
  </svg>
);

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
      <header className="sticky top-0 z-40 bg-[var(--brand-soft)] backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex items-center h-20 gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <Image
                src="/logo.png"
                alt="Dekorento"
                width={1162}
                height={806}
                priority
                className="h-12 w-auto sm:h-14 object-contain"
              />
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

            {/* Right icons — Halena style */}
            <div className="flex items-center gap-5 ml-auto text-black">
              <button
                onClick={() => setOpen(true)}
                className="text-[15px] hover:opacity-60 transition-opacity"
                aria-label="Košík"
              >
                Košík ({count})
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="hover:opacity-60 transition-opacity"
                aria-label="Hledat"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <button className="hidden sm:inline hover:opacity-60 transition-opacity" aria-label="Jazyk">
                <LangIcon />
              </button>
              <Link
                href={user ? "/profil" : "/prihlaseni"}
                className="hover:opacity-60 transition-opacity relative"
                aria-label="Účet"
              >
                <UserIcon />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </Link>
              <button
                className="lg:hidden hover:opacity-60 transition-opacity"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <DotsMenu />
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
              <Image src="/logo.png" alt="Dekorento" width={1162} height={806} className="h-10 w-auto object-contain" />
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
