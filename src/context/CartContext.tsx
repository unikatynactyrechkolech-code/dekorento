"use client";

import { createContext, useContext, useEffect, useReducer, useState, ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartState = { items: CartItem[] };

type Action =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = action.qty ?? 1;
      const exists = state.items.find(i => i.id === action.product.id);
      if (exists) {
        return {
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: action.product.id,
            slug: action.product.slug,
            name: action.product.name,
            price: action.product.price,
            image: action.product.image,
            qty,
          },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.id) };
    case "SET_QTY":
      return {
        items: state.items
          .map(i => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i))
          .filter(i => i.qty > 0),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

const STORAGE_KEY = "dekorento_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const count = state.items.reduce((s, i) => s + i.qty, 0);
  const total = state.items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <Ctx.Provider
      value={{
        items: state.items,
        count,
        total,
        add: (p, q) => {
          dispatch({ type: "ADD", product: p, qty: q });
          setOpen(true);
        },
        remove: id => dispatch({ type: "REMOVE", id }),
        setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
        clear: () => dispatch({ type: "CLEAR" }),
        isOpen,
        setOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
