"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BusinessConfig } from "@/lib/types";

export function Header({ config }: { config: BusinessConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Un hero a pantalla completa puede sostener un header transparente
  // flotando sobre la foto; los demas heros (split/editorial) ya reservan
  // su propio espacio y necesitan el header solido desde el principio.
  const canFloat = config.hero.type === "fullscreen";

  useEffect(() => {
    if (!canFloat) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [canFloat]);

  const floating = canFloat && !scrolled;
  // Halo del color de fondo del tema detras del texto — da contraste sobre
  // cualquier foto sin depender de que la imagen sea clara u oscura.
  const legibilityShadow = floating
    ? "0 2px 24px color-mix(in srgb, var(--color-background) 75%, transparent), 0 1px 3px color-mix(in srgb, var(--color-background) 60%, transparent)"
    : "none";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-[background,border-color,backdrop-filter] duration-[var(--duration-normal)] ease-[var(--ease-standard)] ${
          floating ? "" : "backdrop-blur-md"
        }`}
        style={{
          background: floating ? "transparent" : "color-mix(in srgb, var(--color-background) 82%, transparent)",
          borderBottom: `1px solid ${floating ? "transparent" : "var(--color-border)"}`,
        }}
      >
        <Container
          className={`flex items-center justify-between transition-[padding] duration-[var(--duration-normal)] ease-[var(--ease-standard)] ${
            floating ? "py-6" : "py-4"
          }`}
        >
          <Link href="#hero" className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <span
              className="flex items-center justify-center w-9 h-9 text-sm font-semibold font-display"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-background)",
                borderRadius: "var(--radius-sm)",
                boxShadow: legibilityShadow,
              }}
            >
              {config.logoInitial}
            </span>
            <span
              className="font-display text-lg tracking-wide"
              style={{ color: "var(--color-primary)", textShadow: legibilityShadow }}
            >
              {config.businessName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 shrink-0">
            {config.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide transition-colors duration-[var(--duration-fast)]"
                style={{
                  color: "var(--color-secondary)",
                  textShadow: legibilityShadow,
                  textTransform: "var(--cta-text-transform, none)" as CSSProperties["textTransform"],
                  letterSpacing: "var(--cta-letter-spacing, normal)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={config.hero.ctaPrimary.href}
            className="hidden lg:inline-flex items-center px-5 py-2.5 text-sm font-medium transition-all duration-[var(--duration-normal)] hover:scale-[1.03]"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
              borderRadius: "var(--radius-sm)",
              textTransform: "var(--cta-text-transform, none)" as CSSProperties["textTransform"],
              letterSpacing: "var(--cta-letter-spacing, normal)",
            }}
          >
            {config.hero.ctaPrimary.label}
          </Link>

          <button
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            style={{ filter: floating ? `drop-shadow(${legibilityShadow.split(",")[0]})` : "none" }}
          >
            <span
              className="block w-6 h-[1.5px] transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)]"
              style={{
                background: "var(--color-primary)",
                transform: open ? "translateY(4px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-6 h-[1.5px] transition-opacity duration-[var(--duration-fast)]"
              style={{ background: "var(--color-primary)", opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-6 h-[1.5px] transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)]"
              style={{
                background: "var(--color-primary)",
                transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </Container>
      </header>

      <div
        className="fixed inset-0 z-30 lg:hidden transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)]"
        style={{
          background: "var(--color-background)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "translateY(0)" : "translateY(-8px)",
        }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {config.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl transition-all duration-[var(--duration-normal)]"
              style={{
                color: "var(--color-primary)",
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={config.hero.ctaPrimary.href}
            onClick={() => setOpen(false)}
            className="mt-4 px-8 py-4 text-base font-medium min-h-11"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
              borderRadius: "var(--radius-sm)",
              textTransform: "var(--cta-text-transform, none)" as CSSProperties["textTransform"],
              letterSpacing: "var(--cta-letter-spacing, normal)",
            }}
          >
            {config.hero.ctaPrimary.label}
          </Link>
        </nav>
      </div>
    </>
  );
}
