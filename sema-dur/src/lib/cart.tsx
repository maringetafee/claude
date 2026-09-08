"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ImageKey } from "@/components/ui/Picture";

export type CartLine = {
  /** Stable key: product id + serialised variant. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  ref: string;
  categorySlug: string;
  image?: ImageKey;
  kind: "producto" | "servicio";
  variant?: Record<string, string>;
  qty: number;
};

type AddInput = Omit<CartLine, "key" | "qty"> & { qty?: number };

const STORAGE_KEY = "semadur.cart.v1";
const MAX_QTY = 999;

function variantKey(variant?: Record<string, string>): string {
  if (!variant) return "";
  return Object.entries(variant)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

type State = { lines: CartLine[] };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; input: AddInput }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const key = `${action.input.productId}#${variantKey(action.input.variant)}`;
      const existing = state.lines.find((l) => l.key === key);
      const addQty = action.input.qty ?? 1;
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === key
              ? { ...l, qty: Math.min(MAX_QTY, l.qty + addQty) }
              : l,
          ),
        };
      }
      const line: CartLine = {
        key,
        productId: action.input.productId,
        slug: action.input.slug,
        name: action.input.name,
        ref: action.input.ref,
        categorySlug: action.input.categorySlug,
        image: action.input.image,
        kind: action.input.kind,
        variant: action.input.variant,
        qty: Math.min(MAX_QTY, Math.max(1, addQty)),
      };
      return { lines: [...state.lines, line] };
    }
    case "setQty":
      return {
        lines: state.lines
          .map((l) =>
            l.key === action.key
              ? { ...l, qty: Math.min(MAX_QTY, Math.max(1, action.qty)) }
              : l,
          )
          .filter((l) => l.qty > 0),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  isOpen: boolean;
  lastAddedKey: string | null;
  add: (input: AddInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
      }
    } catch {
      /* private mode / disabled storage — start empty */
    }
    // SSR-safe: localStorage only exists on the client, so the read + flag must
    // happen after mount. This runs once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore quota / disabled storage */
    }
  }, [state.lines, hydrated]);

  // Sync across tabs.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? (JSON.parse(e.newValue) as CartLine[]) : [];
        dispatch({ type: "hydrate", lines: Array.isArray(parsed) ? parsed : [] });
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((input: AddInput) => {
    const key = `${input.productId}#${variantKey(input.variant)}`;
    dispatch({ type: "add", input });
    setLastAddedKey(key);
    setIsOpen(true);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setLastAddedKey(null), 2600);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      hydrated,
      isOpen,
      lastAddedKey,
      add,
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [state.lines, hydrated, isOpen, lastAddedKey, add],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

export function variantSummary(variant?: Record<string, string>): string {
  if (!variant) return "";
  return Object.entries(variant)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}
