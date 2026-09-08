"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, siteConfig, accountNav } from "@/lib/site-config";
import { useUI } from "@/lib/ui-state";
import Icon from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "@/components/layout/Logo";

export default function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu, openSearch } = useUI();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (mobileMenuOpen && !dlg.open) dlg.showModal();
    if (!mobileMenuOpen && dlg.open) dlg.close();
  }, [mobileMenuOpen]);

  // Close on route change.
  useEffect(() => closeMobileMenu(), [pathname, closeMobileMenu]);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeMobileMenu}
      aria-label="Menú"
      className="menu-dialog m-0 h-dvh max-h-dvh w-full max-w-none bg-[var(--color-bg)] p-0 text-[var(--color-ink)] lg:hidden"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-[var(--gutter)] py-3.5">
          <Logo size={26} />
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Cerrar menú"
            className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[var(--gutter)] py-4">
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              openSearch();
            }}
            className="mb-5 flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white px-4 py-3 text-[var(--color-ink-muted)]"
          >
            <Icon name="search" size={18} />
            Buscar herramientas o referencias
          </button>

          <nav aria-label="Principal">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-[var(--color-line)]">
                  {item.children ? (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-lg font-semibold">
                        {item.label}
                        <Icon
                          name="chevron-down"
                          size={20}
                          className="text-[var(--color-ink-muted)] transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <ul className="flex flex-col gap-0.5 pb-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-[var(--radius-sm)] px-3 py-2.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-soft)]"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={item.href}
                            className="block rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-semibold text-[var(--color-brand)]"
                          >
                            Ver todo →
                          </Link>
                        </li>
                      </ul>
                    </details>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3.5 text-lg font-semibold"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Cuenta" className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Mi cuenta
            </p>
            <ul className="flex flex-col">
              <li>
                <Link href="/cuenta" className="block py-2.5 text-[var(--color-ink-soft)]">
                  Acceder / registrarse
                </Link>
              </li>
              {accountNav.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="block py-2.5 text-[var(--color-ink-soft)]">
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)] px-[var(--gutter)] py-4">
          <ButtonLink href="/checkout" size="lg" className="w-full">
            Solicitar presupuesto
          </ButtonLink>
          <div className="mt-3 flex items-center justify-center gap-5 text-sm">
            <a
              href={siteConfig.phone.href}
              className="flex items-center gap-1.5 font-medium text-[var(--color-brand)]"
            >
              <Icon name="phone" size={15} /> {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-[var(--color-brand)]"
            >
              <Icon name="whatsapp" size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
