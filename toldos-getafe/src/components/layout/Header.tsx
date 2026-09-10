"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { primaryNav, siteConfig } from "@/lib/site-config";
import MobileMenu from "./MobileMenu";

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.5-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1l-2.5 2.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setSolid(window.scrollY > 64);
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
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid || menuOpen
            ? "bg-ink/45 backdrop-blur-md border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:h-20 lg:px-16">
          <Link
            href="/"
            className="font-display text-lg font-medium tracking-tight text-paper lg:text-xl"
          >
            Toldos Getafe
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-paper/90 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-accent-soft"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-4">
            <a
              href={siteConfig.phone.href}
              className="flex items-center gap-2 text-sm font-medium text-paper transition-colors hover:text-accent-soft"
            >
              <PhoneIcon />
              <span className="hidden sm:inline">{siteConfig.phone.display}</span>
              <span className="sr-only sm:hidden">
                Llamar al {siteConfig.phone.display}
              </span>
            </a>
            <a
              href="/contacto/"
              className="hidden rounded-none border border-paper/40 px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:border-accent-soft hover:bg-accent-soft lg:block"
            >
              Solicitar presupuesto
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={`block h-px w-6 bg-paper transition-all duration-300 ${
                  menuOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-paper transition-all duration-300 ${
                  menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
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
