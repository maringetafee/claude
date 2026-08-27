"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BusinessConfig } from "@/lib/types";

export function Header({ config }: { config: BusinessConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-40 backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--color-background) 78%, transparent)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Container className="flex items-center justify-between py-5">
          <Link href="#hero" className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-9 h-9 text-sm font-semibold font-display"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-background)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {config.logoInitial}
            </span>
            <span className="font-display text-lg tracking-wide" style={{ color: "var(--color-primary)" }}>
              {config.businessName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {config.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide transition-colors duration-[var(--duration-fast)]"
                style={{ color: "var(--color-secondary)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={config.hero.ctaPrimary.href}
            className="hidden md:inline-flex items-center px-5 py-2.5 text-sm font-medium transition-all duration-[var(--duration-normal)] hover:scale-[1.03]"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-background)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {config.hero.ctaPrimary.label}
          </Link>

          <button
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
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
        className="fixed inset-0 z-30 md:hidden transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)]"
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
              color: "var(--color-background)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {config.hero.ctaPrimary.label}
          </Link>
        </nav>
      </div>
    </>
  );
}
