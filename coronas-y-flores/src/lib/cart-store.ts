"use client";

import { useSyncExternalStore } from "react";

// Carrito en localStorage. Los precios guardados son solo para mostrar: el
// servidor recalcula todo desde la base de datos al crear el pedido.

export type CartItem = {
  key: string;
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantName: string | null;
  image: string | null;
  unitPriceCents: number;
  qty: number;
  ribbonText: string;
};

export const MAX_QTY = 20;
const STORAGE_KEY = "cyf-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isCartItem(x: unknown): x is CartItem {
  const i = x as CartItem;
  return !!i && typeof i.key === "string" && typeof i.productId === "string" && typeof i.qty === "number";
}

function read(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  items = read();
  // Mantiene sincronizadas varias pestañas abiertas
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      items = read();
      emit();
    }
  });
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // modo privado / almacenamiento bloqueado: el carrito vive solo en memoria
  }
  emit();
}

function subscribe(listener: () => void) {
  ensureHydrated();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  ensureHydrated();
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

export function lineKey(productId: string, variantId: string | null, ribbonText: string) {
  return [productId, variantId ?? "", ribbonText.trim()].join("|");
}

export function addToCart(input: Omit<CartItem, "key" | "qty">, qty = 1) {
  ensureHydrated();
  const key = lineKey(input.productId, input.variantId, input.ribbonText);
  const existing = items.find((i) => i.key === key);
  const next = existing
    ? items.map((i) => (i.key === key ? { ...i, ...input, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
    : [...items, { ...input, ribbonText: input.ribbonText.trim(), key, qty: Math.min(qty, MAX_QTY) }];
  commit(next);
  showToast(`${input.name}${input.variantName ? ` · ${input.variantName}` : ""} añadido al carrito`);
}

export function setQty(key: string, qty: number) {
  ensureHydrated();
  commit(
    qty <= 0
      ? items.filter((i) => i.key !== key)
      : items.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)),
  );
}

export function removeFromCart(key: string) {
  ensureHydrated();
  commit(items.filter((i) => i.key !== key));
}

export function clearCart() {
  ensureHydrated();
  commit(EMPTY);
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount(): number {
  return useCart().reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(list: CartItem[]): number {
  return list.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);
}

// ---------- Aviso "añadido al carrito" ----------
type Toast = { id: number; message: string } | null;
let toast: Toast = null;
const toastListeners = new Set<() => void>();

export function showToast(message: string) {
  toast = { id: Date.now(), message };
  toastListeners.forEach((l) => l());
}

export function dismissToast() {
  toast = null;
  toastListeners.forEach((l) => l());
}

export function useToast(): Toast {
  return useSyncExternalStore(
    (l) => {
      toastListeners.add(l);
      return () => {
        toastListeners.delete(l);
      };
    },
    () => toast,
    () => null,
  );
}

/** true solo en el navegador tras hidratar (evita desajustes de SSR). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
