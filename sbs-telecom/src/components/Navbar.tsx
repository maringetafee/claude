"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";
import { company, navLinks } from "@/lib/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        scrolled ? "py-3 bg-carbon-950/85 backdrop-blur-md border-b border-bone-100/10" : "py-6 bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10" aria-label="Principal">
        <Link href="#inicio" className="text-bone-100 transition-opacity hover:opacity-80" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="mono-label text-[11px] text-bone-400 transition-colors hover:text-bone-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={company.phoneHref} className="font-mono text-sm text-bone-200 hover:text-signal-400 transition-colors">
            {company.phone}
          </a>
          <Button href="#contacto" className="!py-3">
            Solicitar presupuesto
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative z-[60] flex h-11 w-11 -mr-2.5 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-px w-6 bg-bone-100 transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-bone-100 transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-carbon-950 px-6 pb-10 pt-28 transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className="border-b border-bone-100/10 py-5"
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-display text-3xl font-semibold tracking-tight text-bone-100 transition-all duration-500 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-5">
          <a href={company.phoneHref} className="font-mono text-lg text-bone-200">
            {company.phone}
          </a>
          <Button href="#contacto" className="w-full justify-center" >
            Solicitar presupuesto
          </Button>
        </div>
      </div>
    </header>
  );
}
