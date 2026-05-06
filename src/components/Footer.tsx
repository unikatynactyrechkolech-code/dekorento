"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Pinterest = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12c0-2.5 2-4.5 4.5-4.5S17 9.5 17 12s-1.5 4-3.5 4c-1 0-1.5-.5-2-1m0 0L9 21" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-24">
      {/* Newsletter — Halena 3-col layout */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <h3 className="font-serif text-3xl sm:text-4xl text-black text-center md:text-left">
            Přihlaste se k odběru
          </h3>
          <p className="font-serif text-base text-black/70 text-center leading-relaxed">
            Posíláme novinky a speciální nabídky.<br />
            Bez spamu — slibujeme.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (email) setDone(true);
            }}
            className="relative"
          >
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Váš e-mail"
              className="w-full bg-transparent border-b border-black/40 focus:border-black outline-none py-4 pr-12 font-serif text-base placeholder:text-black/40"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-black hover:opacity-60"
              aria-label="Odeslat"
            >
              {done ? "✓" : <ArrowRight className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </form>
        </div>
      </section>

      {/* Bottom row: logo+copy | links | customer service */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Image src="/logo.png" alt="Dekorento" width={1162} height={806} className="h-12 w-auto object-contain mb-5" />
            <p className="text-xs text-black/60 tracking-wide">
              © {new Date().getFullYear()} Dekorento. Všechna práva vyhrazena.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-black/15 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-black/15 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-black/15 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-colors">
                <Pinterest className="w-4 h-4" />
              </a>
            </div>
          </div>

          <ul className="space-y-3 font-serif text-base text-black/80">
            <li><Link href="#" className="hover:opacity-60">Obchodní podmínky</Link></li>
            <li><Link href="#" className="hover:opacity-60">FAQ</Link></li>
            <li><Link href="#" className="hover:opacity-60">Doprava & vrácení</Link></li>
            <li><Link href="#" className="hover:opacity-60">Sledovat objednávku</Link></li>
          </ul>

          <div>
            <h4 className="font-serif text-2xl text-black mb-5">Zákaznický servis</h4>
            <p className="text-sm text-black/70 leading-relaxed">
              unikatynactyrechkolech@gmail.com<br />
              +420 777 123 456<br />
              Praha & okolí
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
