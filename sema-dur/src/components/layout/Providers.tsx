"use client";

import { CartProvider } from "@/lib/cart";
import { UIProvider } from "@/lib/ui-state";
import CartDrawer from "@/components/commerce/CartDrawer";
import SearchOverlay from "@/components/commerce/SearchOverlay";
import MobileMenu from "@/components/layout/MobileMenu";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <UIProvider>
        {children}
        <MobileMenu />
        <CartDrawer />
        <SearchOverlay />
      </UIProvider>
    </CartProvider>
  );
}
