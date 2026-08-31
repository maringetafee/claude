"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { navLinks, siteConfig } from "@/lib/config";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const transparent = isHome && !scrolled && !menuOpen;

  const header = (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out",
        transparent
          ? "bg-transparent border-b border-transparent py-6"
          : "bg-paper/90 backdrop-blur-md border-b border-line py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
      )}
    >
      <div className="container-edit flex items-center justify-between">
        <Link href="/" onClick={() => setMenuOpen(false)} className="relative z-10">
          <Logo tone={transparent ? "light" : "dark"} className="h-6 md:h-7" />
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-[0.74rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 py-1",
                "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
                transparent ? "text-paper/90 hover:text-paper" : "text-ink-soft hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/propiedades"
            className={cn(
              "inline-flex items-center gap-2.5 px-6 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] border transition-colors duration-300",
              transparent
                ? "border-paper/70 text-paper hover:bg-paper hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-paper"
            )}
          >
            Ver propiedades
          </Link>
        </div>

        <button
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-10 flex h-9 w-9 flex-col items-center justify-center gap-[6px] lg:hidden"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn("h-px w-6 origin-center", menuOpen || !transparent ? "bg-ink" : "bg-paper")}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn("h-px w-6 origin-center", menuOpen || !transparent ? "bg-ink" : "bg-paper")}
          />
        </button>
      </div>
    </header>
  );

  const menuPanel = (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-[var(--section-x)] pt-28 pb-12 lg:hidden"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: EASE }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-line py-4 font-serif text-4xl font-light text-ink"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="flex flex-col gap-4"
          >
            <Link
              href="/propiedades"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit items-center gap-2.5 border border-ink px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink"
            >
              Ver propiedades
            </Link>
            <a href={`tel:${siteConfig.phone}`} className="text-sm text-ink-soft">
              {siteConfig.phoneDisplay}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {header}
      {mounted && createPortal(menuPanel, document.body)}
    </>
  );
}
