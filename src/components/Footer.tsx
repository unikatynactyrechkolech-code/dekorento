"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

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
      {/* Newsletter */}
      <section className="bg-[var(--brand-soft)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
            Přihlaste se k odběru
          </h3>
          <p className="mt-3 text-neutral-600">
            Posíláme novinky a speciální nabídky. Žádný spam.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (email) setDone(true);
            }}
            className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Váš e-mail"
              className="flex-1 px-5 py-4 rounded-full bg-white border border-transparent focus:border-[var(--brand-dark)] focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white font-semibold px-7 py-4 rounded-full inline-flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              {done ? "Přihlášeno ✓" : "Odebírat"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2">
            <div className="text-2xl font-black tracking-[0.2em]">DEKORENTO</div>
            <p className="mt-4 text-sm text-neutral-500 max-w-xs leading-relaxed">
              Půjčovna prémiových fotopozadí, rekvizit a dekorací.
              Detaily tvoří atmosféru.
            </p>
            <div className="flex gap-2 mt-6">
              <a href="#" className="w-9 h-9 rounded-full border border-neutral-200 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-neutral-200 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-neutral-200 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-colors">
                <Pinterest className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-5">Obchod</h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><Link href="/produkty" className="hover:text-black">Vše</Link></li>
              <li><Link href="/produkty?cat=Glitter%20%26%20Flitry" className="hover:text-black">Glitter & Flitry</Link></li>
              <li><Link href="/produkty?cat=L%C3%A1tkov%C3%A1%20pozad%C3%AD" className="hover:text-black">Látková pozadí</Link></li>
              <li><Link href="/produkty?cat=Tematick%C3%A1%20pozad%C3%AD" className="hover:text-black">Tematická</Link></li>
              <li><Link href="/inspirace" className="hover:text-black">Inspirace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-5">Kontakt</h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@dekorento.cz</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +420 777 123 456</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Praha & okolí</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Dekorento. Všechna práva vyhrazena.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-black">Obchodní podmínky</Link>
              <Link href="#" className="hover:text-black">FAQ</Link>
              <Link href="#" className="hover:text-black">Doprava</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
