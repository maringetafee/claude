"use client";

import Link from "next/link";
import { useEffect } from "react";
import { dismissToast, useToast } from "@/lib/cart-store";

export function CartToast() {
  const toast = useToast();

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(dismissToast, 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite">
      <span>{toast?.message}</span>
      {toast && (
        <Link className="btn btn--solid" href="/carrito" onClick={dismissToast}>
          Ver carrito
        </Link>
      )}
    </div>
  );
}
