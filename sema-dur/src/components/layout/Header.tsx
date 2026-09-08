"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, siteConfig } from "@/lib/site-config";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui-state";
import { ButtonLink } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/layout/Logo";

export default function Header() {
  const pathname = usePathname();
  const { count, openCart, hydrated } = useCart();
  const { openSearch, openMobileMenu } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-[var(--color-line)] bg-white/95 shadow-[var(--shadow-sm)] backdrop-blur"
          : "border-transparent bg-[var(--color-bg)]"
      }`}
    >
      {/* Utility strip */}
      <div
        className={`hidden overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-bg-invert)] text-[var(--color-ink-invert-soft)] transition-[height,opacity] duration-300 lg:block ${
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        }`}
      >
        <div className="container-page flex h-9 items-center justify-between text-[0.78rem]">
          <p className="flex items-center gap-2">
            <Icon name="shield" size={13} className="text-[var(--color-accent)]" />
            Fabricación y reafilado propios desde {siteConfig.founded} · Distribuidor
            oficial Freud y Ceratizit
          </p>
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.phone.href}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Icon name="phone" size={13} /> {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Icon name="whatsapp" size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`container-page flex items-center justify-between gap-4 transition-[padding] duration-300 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <Link
          href="/"
          className="shrink-0"
          aria-label={`${siteConfig.name} — inicio`}
          onClick={() => setOpenMenu(null)}
        >
          <Logo size={scrolled ? 26 : 30} />
        </Link>

        <nav
          ref={navRef}
          aria-label="Principal"
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={scheduleClose}
        >
          {primaryNav.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu(item.label);
                }}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() =>
                    setOpenMenu((cur) => (cur === item.label ? null : item.label))
                  }
                  className={`flex items-center gap-1 rounded-[var(--radius-xs)] px-3 py-2 text-[0.92rem] font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {item.label}
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={`transition-transform ${openMenu === item.label ? "rotate-180" : ""}`}
                  />
                </button>

                {openMenu === item.label ? (
                  <div
                    className="absolute left-1/2 top-full z-50 w-[26rem] -translate-x-1/2 pt-3"
                    onMouseEnter={cancelClose}
                  >
                    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-lg)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group flex flex-col gap-0.5 rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors hover:bg-[var(--color-bg-soft)]"
                        >
                          <span className="flex items-center justify-between text-[0.92rem] font-semibold text-[var(--color-ink)]">
                            {child.label}
                            <Icon
                              name="arrow-right"
                              size={15}
                              className="translate-x-[-4px] text-[var(--color-brand)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                            />
                          </span>
                          {child.description ? (
                            <span className="text-[0.82rem] leading-snug text-[var(--color-ink-muted)]">
                              {child.description}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                      <Link
                        href={item.href}
                        className="mt-1 block rounded-[var(--radius-sm)] bg-[var(--color-bg-soft)] px-3 py-2.5 text-[0.86rem] font-semibold text-[var(--color-brand)]"
                      >
                        Ver todo →
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[var(--radius-xs)] px-3 py-2 text-[0.92rem] font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Buscar productos"
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-brand)]"
          >
            <Icon name="search" size={20} />
          </button>

          <Link
            href="/cuenta"
            aria-label="Mi cuenta"
            className="hidden h-10 w-10 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-brand)] sm:grid"
          >
            <Icon name="user" size={20} />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Solicitud de presupuesto${hydrated && count ? `, ${count} artículos` : ""}`}
            className="relative grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-brand)]"
          >
            <Icon name="cart" size={20} />
            {hydrated && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--color-brand)] px-1 text-[0.66rem] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          <span className="ml-1 hidden lg:block">
            <ButtonLink href="/checkout" size="sm">
              Solicitar presupuesto
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={openMobileMenu}
            aria-label="Abrir menú"
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-soft)] lg:hidden"
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
