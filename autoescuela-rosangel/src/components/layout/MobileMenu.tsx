"use client";

import Link from "next/link";
import { primaryNav, siteConfig, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-paper transition-opacity duration-300 lg:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <nav className="flex h-full flex-col justify-between px-6 pb-10 pt-24">
        <ul className="flex flex-col gap-1 text-2xl font-display font-medium">
          {primaryNav.map((item, i) => (
            <li
              key={item.href}
              className="border-b border-line py-4 transition-all duration-500"
              style={{
                transitionDelay: open ? `${i * 40}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
              }}
            >
              <Link href={item.href} onClick={onClose}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <a
            href={siteConfig.phone.href}
            className="flex items-center justify-center gap-2 rounded-sm border border-ink/15 py-3.5 text-sm font-medium"
          >
            <PhoneIcon /> Llamar: {siteConfig.phone.display}
          </a>
          <a
            href={whatsappHref(whatsappMessages.general)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-sm bg-whatsapp py-3.5 text-sm font-semibold text-white"
          >
            <WhatsAppIcon className="h-5 w-5" /> Escribir por WhatsApp
          </a>
          <Link
            href="/contacto/"
            onClick={onClose}
            className="rounded-sm bg-signal py-3.5 text-center text-sm font-semibold text-paper"
          >
            Quiero mi carnet
          </Link>
        </div>
      </nav>
    </div>
  );
}
