"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BagIcon } from "@/components/Icons";
import { BrandMark } from "@/components/site/BrandMark";
import { lenisRef } from "@/components/site/SiteMotion";
import { BRAND } from "@/lib/brand";
import { useCartCount, useMounted } from "@/lib/cart-store";

const NAV = [
  { href: "/tienda", label: "Tienda" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#metodo", label: "El taller" },
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#visitanos", label: "Visítanos" },
];

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 30, () => false);
  const [open, setOpen] = useState(false);
  const count = useCartCount();
  const mounted = useMounted();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenisRef.current?.stop();
    else lenisRef.current?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const isActive = (href: string) => href === "/tienda" && (pathname.startsWith("/tienda") || pathname.startsWith("/producto"));

  return (
    <>
      <header className={`site-header${scrolled || !isHome ? " is-scrolled" : ""}`}>
        <div className="container header-inner">
          <Link className="brand magnetic" href="/" aria-label={`${BRAND.name}, inicio`}>
            <BrandMark />
            <span className="brand__name">
              <strong>{BRAND.name}</strong>
              <small>
                {BRAND.rubro} · {BRAND.city}
              </small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="btn btn--solid magnetic header-cta" href="/tienda">
              Pedir ramo
            </Link>
            <Link
              className="cart-btn magnetic"
              href="/carrito"
              aria-label={mounted && count ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Carrito"}
            >
              <BagIcon />
              {mounted && count > 0 && <span className="cart-btn__count">{count}</span>}
            </Link>
            <button
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="menu-toggle"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open} data-lenis-prevent>
        <button className="mobile-menu__close" aria-label="Cerrar menú" onClick={close}>
          ×
        </button>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>
            {item.label}
          </Link>
        ))}
        <Link href="/carrito" onClick={close}>
          Carrito{mounted && count ? ` (${count})` : ""}
        </Link>
      </div>
    </>
  );
}
