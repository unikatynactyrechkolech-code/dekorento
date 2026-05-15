"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="text-sm bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full font-medium"
    >
      Odhlásit
    </button>
  );
}
