"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type AppUser = {
  id: string;
  email: string;
  name: string;
};

type AuthCtx = {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function toAppUser(u: AuthUser | null): AppUser | null {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? "",
    name: (u.user_metadata?.full_name as string) || u.email?.split("@")[0] || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(toAppUser(data.user));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAppUser(session?.user ?? null));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        async login(email, password) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return { ok: false, error: translateError(error.message) };
          return { ok: true };
        },
        async register(name, email, password) {
          if (!name || !email || password.length < 6) {
            return { ok: false, error: "Vyplňte všechna pole. Heslo min. 6 znaků." };
          }
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          });
          if (error) return { ok: false, error: translateError(error.message) };
          return { ok: true };
        },
        async logout() {
          await supabase.auth.signOut();
          setUser(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

function translateError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return "Nesprávný e-mail nebo heslo.";
  if (/already registered/i.test(msg)) return "E-mail je již zaregistrován.";
  if (/Password should be at least/i.test(msg)) return "Heslo musí mít alespoň 6 znaků.";
  if (/rate limit/i.test(msg)) return "Příliš mnoho pokusů, zkuste to za chvíli.";
  return msg;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
