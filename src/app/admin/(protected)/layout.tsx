import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-black text-lg">
              Dekorento <span className="text-neutral-400 font-light">/ admin</span>
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/admin" className="hover:text-black text-neutral-600">Přehled</Link>
              <Link href="/admin/produkty" className="hover:text-black text-neutral-600">Produkty</Link>
              <Link href="/admin/objednavky" className="hover:text-black text-neutral-600">Objednávky</Link>
              <Link href="/admin/kalendar" className="hover:text-black text-neutral-600">Kalendář</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-neutral-500 hover:text-black">← Zpět na e-shop</Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
