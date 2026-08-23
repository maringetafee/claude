import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./Logo";

const NAV_LINKS = [
  { label: "Precios", href: "#presupuesto" },
  { label: "Proceso", href: "#proceso" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-marble/10 bg-charcoal/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a
            href="#top"
            className="flex items-center gap-2.5 font-display text-lg tracking-[0.15em] text-marble"
          >
            <LogoMark className="h-6 w-6" />
            MAKEMY<span className="text-iris">WEB</span>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-marble/70 transition-colors hover:text-marble"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contacto"
            className="hidden rounded-full border border-iris/50 px-5 py-2.5 text-sm tracking-wide text-marble transition-all hover:border-iris hover:bg-iris/10 md:inline-block"
          >
            Pide tu presupuesto
          </a>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-1.5 md:hidden cursor-pointer"
          >
            <span className="h-px w-6 bg-marble" />
            <span className="h-px w-6 bg-marble" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-charcoal/98 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="flex items-center gap-2.5 font-display text-lg tracking-[0.15em] text-marble">
                <LogoMark className="h-6 w-6" />
                MAKEMY<span className="text-iris">WEB</span>
              </span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
                className="text-3xl leading-none text-marble/70 cursor-pointer"
              >
                ×
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="font-display text-3xl text-marble/90"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contacto"
                onClick={handleNavClick}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.06 }}
                className="mt-4 rounded-full border border-iris/50 px-6 py-3 text-sm tracking-wide text-marble"
              >
                Pide tu presupuesto
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
