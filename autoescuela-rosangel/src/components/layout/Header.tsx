"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, siteConfig, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { PhoneIcon } from "@/components/icons";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tickingRef = useRef(false);
  const pathname = usePathname();

  // Cierra el menú al cambiar de ruta ajustando el estado durante el
  // render (patrón recomendado por React para "resetear estado cuando
  // cambia una prop"), en vez de un efecto con setState síncrono.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setSolid(window.scrollY > 24);
        tickingRef.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Ir al contenido
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          solid || menuOpen
            ? "border-line bg-paper/90 backdrop-blur-md"
            : "border-transparent bg-paper/0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-10">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-signal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={siteConfig.phone.href}
              className="hidden items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-signal sm:flex"
            >
              <PhoneIcon />
              {siteConfig.phone.display}
            </a>
            <a
              href={whatsappHref(whatsappMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-sm border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper md:block"
            >
              WhatsApp
            </a>
            <Link
              href="/contacto/"
              className="rounded-sm bg-signal px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-signal-dark sm:px-5"
            >
              Quiero mi carnet
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={`block h-0.5 w-6 bg-ink transition-all duration-300 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-all duration-300 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
