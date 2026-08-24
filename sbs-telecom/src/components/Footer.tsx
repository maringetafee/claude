import Link from "next/link";
import { Logo } from "./Logo";
import { company, services } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative border-t border-bone-100/10 bg-carbon-950 pt-20 pb-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-bone-500">
              Más de {company.foundedYears} años instalando, reparando y manteniendo antenas, porteros y sistemas de
              seguridad en la Comunidad de Madrid.
            </p>
          </div>

          <div>
            <h3 className="mono-label text-[10px] text-bone-600">Servicios</h3>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <a href="#servicios" className="text-sm text-bone-400 transition-colors hover:text-bone-100">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mono-label text-[10px] text-bone-600">Contacto</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-bone-400">
              <li>
                {company.address.street}, {company.address.postalCode} {company.address.city}
              </li>
              <li>
                <a href={company.phoneHref} className="hover:text-bone-100">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={company.emailHref} className="hover:text-bone-100">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mono-label text-[10px] text-bone-600">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/aviso-legal" className="text-sm text-bone-400 transition-colors hover:text-bone-100">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-bone-400 transition-colors hover:text-bone-100">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-bone-400 transition-colors hover:text-bone-100">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bone-100/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-bone-600">
            © {new Date().getFullYear()} {company.legalName} — Todos los derechos reservados.
          </p>
          <p className="font-mono text-[11px] text-bone-600">Madrid, España</p>
        </div>
      </div>
    </footer>
  );
}
