"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@/lib/types";

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "dekorento_user_v1";
const USERS_KEY = "dekorento_users_v1";

type StoredUser = User & { password: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  function persist(u: User | null) {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  }

  function getUsers(): StoredUser[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function saveUsers(list: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  return (
    <Ctx.Provider
      value={{
        user,
        async login(email, password) {
          const users = getUsers();
          const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
          if (!u) return { ok: false, error: "Účet s tímto e-mailem neexistuje." };
          if (u.password !== password) return { ok: false, error: "Nesprávné heslo." };
          persist({ email: u.email, name: u.name });
          return { ok: true };
        },
        async register(name, email, password) {
          if (!name || !email || password.length < 4) return { ok: false, error: "Vyplňte všechna pole. Heslo min. 4 znaky." };
          const users = getUsers();
          if (users.some(x => x.email.toLowerCase() === email.toLowerCase()))
            return { ok: false, error: "E-mail je již zaregistrován." };
          users.push({ name, email, password });
          saveUsers(users);
          persist({ name, email });
          return { ok: true };
        },
        logout: () => persist(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
