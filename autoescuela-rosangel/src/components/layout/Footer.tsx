import Link from "next/link";
import { centers, footerLinks, legalLinks, siteConfig } from "@/lib/site-config";
import { PhoneIcon, PinIcon } from "@/components/icons";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper/80">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-paper" />
            <p className="mt-4 max-w-xs text-sm text-paper/60">
              {siteConfig.tagline}
            </p>
            <div className="mt-5 flex gap-3">
              {siteConfig.instagram && (
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase tracking-wide text-paper/60 underline underline-offset-4 hover:text-paper"
                >
                  Instagram
                </a>
              )}
              {siteConfig.facebook && (
                <a
                  href={siteConfig.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase tracking-wide text-paper/60 underline underline-offset-4 hover:text-paper"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-paper/40">
              Autoescuela
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-paper/40">
              Centros en Getafe
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {centers.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/centros/${c.slug}/`}
                    className="flex items-start gap-2 transition-colors hover:text-paper"
                  >
                    <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-paper/40" />
                    <span>
                      {c.zoneLabel}
                      <span className="block text-paper/50">{c.street}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-paper/40">
              Contacto
            </p>
            <div className="mt-4 space-y-2.5 text-sm">
              <a
                href={siteConfig.phone.href}
                className="flex items-center gap-2 transition-colors hover:text-paper"
              >
                <PhoneIcon className="h-4 w-4 text-paper/40" />
                {siteConfig.phone.display}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · DGT {siteConfig.dgtCode}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-paper/70">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
