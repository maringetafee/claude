"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-store";

export function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
