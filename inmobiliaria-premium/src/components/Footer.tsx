import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/config";

const footerNav = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Comprar", href: "/propiedades?operacion=venta" },
  { label: "Alquilar", href: "/propiedades?operacion=alquiler" },
  { label: "Vender", href: "/#servicios" },
];

const footerAgency = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Sobre nosotros", href: "/#agencia" },
  { label: "Contacto", href: "/#contacto" },
];

const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-edit py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo className="h-7" />
            <p className="mt-6 max-w-xs text-[0.92rem] leading-relaxed text-stone">
              {siteConfig.claim}. Compra, venta y alquiler de propiedades
              en el sur de Madrid.
            </p>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-[0.8rem] uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              {siteConfig.instagramHandle}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-5 lg:grid-cols-2">
            <div>
              <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-stone">
                Propiedades
              </p>
              <ul className="space-y-3">
                {footerNav.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.92rem] text-ink-soft transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-stone">
                Agencia
              </p>
              <ul className="space-y-3">
                {footerAgency.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.92rem] text-ink-soft transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-stone">
              Contacto
            </p>
            <ul className="space-y-3 text-[0.92rem] text-ink-soft">
              <li>{siteConfig.address}</li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-ink">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-[0.8rem] text-stone md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
