"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type UIState = {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
};

const UICtx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const value = useMemo<UIState>(
    () => ({
      searchOpen,
      openSearch,
      closeSearch,
      mobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
    }),
    [
      searchOpen,
      mobileMenuOpen,
      openSearch,
      closeSearch,
      openMobileMenu,
      closeMobileMenu,
    ],
  );

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export function useUI(): UIState {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
}
