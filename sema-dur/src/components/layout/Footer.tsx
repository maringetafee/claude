import Link from "next/link";
import {
  siteConfig,
  footerColumns,
  legalLinks,
} from "@/lib/site-config";
import Logo from "@/components/layout/Logo";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-invert)] text-[var(--color-ink-invert-soft)]">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr] lg:py-20">
        <div className="flex flex-col gap-5">
          <Logo size={30} invert />
          <p className="max-w-sm text-sm leading-relaxed">
            {siteConfig.legalName}. Diseño, fabricación y reafilado de herramientas
            de corte a medida para madera y metal desde {siteConfig.founded}.
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <a
                href={siteConfig.phone.href}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Icon name="phone" size={16} className="text-[var(--color-accent)]" />
                {siteConfig.phone.display}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Icon name="whatsapp" size={16} className="text-[var(--color-accent)]" />
                {siteConfig.whatsapp.display} (WhatsApp)
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Icon name="mail" size={16} className="text-[var(--color-accent)]" />
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
              <span>{siteConfig.address.full}</span>
            </li>
          </ul>
          <div className="flex gap-3 pt-1">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-white/15 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Sema-Dur en Facebook"
            >
              <Icon name="facebook" size={16} />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-white/15 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Sema-Dur en Instagram"
            >
              <Icon name="instagram" size={16} />
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6">
          <p className="text-[0.72rem] leading-relaxed text-[var(--color-ink-invert-soft)]/80">
            {siteConfig.fundingNotice}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos los derechos
            reservados.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
