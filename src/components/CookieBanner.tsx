"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "dekorento_cookies_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center px-4 pb-4 sm:pb-6 pointer-events-none"
    >
      <div
        className="pointer-events-auto w-full max-w-3xl rounded-xl border border-[var(--brand)] bg-[var(--brand-soft)] shadow-[0_8px_40px_rgba(59,184,179,0.18)] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
      >
        {/* Cookie icon */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--brand)] flex items-center justify-center text-xl select-none">
          🍪
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-sm text-black tracking-wide mb-1">
            Tento web používá cookies
          </p>
          <p className="font-sans text-xs text-black/60 leading-relaxed">
            Používáme soubory cookies pro zlepšení vašeho zážitku, analýzu návštěvnosti a personalizaci obsahu.
            Více informací naleznete v našich{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors">
              zásadách ochrany soukromí
            </Link>
            .
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none font-sans text-xs font-medium tracking-widest uppercase border border-black/30 text-black/60 hover:border-black hover:text-black transition-colors py-2.5 px-5 rounded"
          >
            Odmítnout
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none font-sans text-xs font-medium tracking-widest uppercase bg-[var(--brand-dark)] text-white hover:bg-black transition-colors py-2.5 px-5 rounded"
          >
            Přijmout vše
          </button>
        </div>
      </div>
    </div>
  );
}
