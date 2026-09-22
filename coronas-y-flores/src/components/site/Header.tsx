"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BagIcon, UserIcon } from "@/components/Icons";
import { BrandMark } from "@/components/site/BrandMark";
import { lenisRef } from "@/components/site/SiteMotion";
import { BRAND } from "@/lib/brand";
import { useCartCount, useMounted } from "@/lib/cart-store";

const OFFERS = { href: "/tienda/ofertas", label: "Ofertas" };
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

// La cookie de sesión de Supabase basta para pintar el icono de cuenta como
// "con sesión"; quién es de verdad lo comprueba el servidor en /cuenta.
function hasSessionCookie() {
  return /(?:^|;\s*)sb-[^=]+-auth-token(?:\.\d+)?=/.test(document.cookie);
}

function subscribeFocus(cb: () => void) {
  window.addEventListener("focus", cb);
  return () => window.removeEventListener("focus", cb);
}

export function Header({ hasOffers = false }: { hasOffers?: boolean }) {
  const pathname = usePathname();
  // Se vuelve a leer en cada render (p. ej. al cambiar de página tras entrar o salir)
  const loggedIn = useSyncExternalStore(subscribeFocus, hasSessionCookie, () => false);
  const nav = hasOffers ? [NAV[0], OFFERS, ...NAV.slice(1)] : NAV;
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
  const isActive = (href: string) =>
    href === OFFERS.href
      ? pathname === OFFERS.href
      : href === "/tienda" && pathname !== OFFERS.href && (pathname.startsWith("/tienda") || pathname.startsWith("/producto"));

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
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item === OFFERS ? "nav-offers" : undefined}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="btn btn--solid magnetic header-cta" href="/tienda">
              Pedir ramo
            </Link>
            <Link
              className={`cart-btn account-btn magnetic${loggedIn ? " is-in" : ""}`}
              href="/cuenta"
              aria-label={loggedIn ? "Mi cuenta" : "Iniciar sesión o crear cuenta"}
              title={loggedIn ? "Mi cuenta" : "Iniciar sesión"}
            >
              <UserIcon />
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
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>
            {item.label}
          </Link>
        ))}
        <Link href="/carrito" onClick={close}>
          Carrito{mounted && count ? ` (${count})` : ""}
        </Link>
        <Link href="/cuenta" onClick={close}>
          {loggedIn ? "Mi cuenta" : "Entrar / Registrarse"}
        </Link>
      </div>
    </>
  );
}
