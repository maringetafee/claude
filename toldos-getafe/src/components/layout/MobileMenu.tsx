"use client";

import Link from "next/link";
import { primaryNav, siteConfig } from "@/lib/site-config";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col bg-ink transition-opacity duration-500 lg:hidden ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
        {primaryNav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="border-b border-paper/10 py-4 font-display text-4xl text-paper transition-transform duration-500"
            style={{
              transitionDelay: open ? `${i * 60}ms` : "0ms",
              transform: open ? "translateY(0)" : "translateY(12px)",
              opacity: open ? 1 : 0,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-3 px-8 pb-10 text-paper/70">
        <a href={siteConfig.phone.href} className="text-sm">
          {siteConfig.phone.display}
        </a>
        <a href={`mailto:${siteConfig.email}`} className="text-sm">
          {siteConfig.email}
        </a>
        <a
          href="/contacto"
          onClick={onClose}
          className="mt-4 inline-flex w-fit bg-accent px-6 py-3 text-sm font-medium text-paper"
        >
          Solicitar presupuesto
        </a>
      </div>
    </div>
  );
}
