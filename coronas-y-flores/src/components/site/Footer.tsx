import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { telHref, whatsappHref, type SiteContent } from "@/lib/content-shared";
import { CopyrightYear } from "@/components/site/CopyrightYear";

export function Footer({ content }: { content: SiteContent }) {
  const { contact, footer } = content;
  return (
    <footer className="site-footer" id="pedir">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__title">{BRAND.name}</p>
            <p style={{ color: "rgba(255,255,255,.6)", maxWidth: "34ch" }}>{footer.tagline}</p>
          </div>
          <div className="footer__col">
            <h4>Explora</h4>
            <Link href="/tienda">Tienda online</Link>
            <Link href="/#servicios">Servicios</Link>
            <Link href="/#metodo">El taller</Link>
            <Link href="/#trabajos">Trabajos</Link>
            <Link href="/#opiniones">Opiniones</Link>
          </div>
          <div className="footer__col">
            <h4>Contacto</h4>
            <a href={telHref(contact.phone)}>{contact.phone}</a>
            {contact.whatsapp && (
              <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            <Link href="/#visitanos">{contact.address}</Link>
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
          </div>
          <div className="footer__col">
            <h4>Pedidos</h4>
            <p>{footer.ordersNote}</p>
            <Link className="btn btn--solid magnetic" href="/tienda">
              Pedir ahora
            </Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © <CopyrightYear /> {BRAND.name}. Todos los derechos reservados.
          </span>
          <nav className="footer__legal" aria-label="Información legal">
            <Link href="/legal/aviso-legal">Aviso legal</Link>
            <Link href="/legal/privacidad">Privacidad</Link>
            <Link href="/legal/cookies">Cookies</Link>
            <Link href="/legal/condiciones-de-venta">Condiciones de venta</Link>
          </nav>
          <span>{BRAND.city}, España</span>
        </div>
        <div className="footer__credit">
          <a className="magnetic" href="https://makemyweb.es" target="_blank" rel="noopener">
            <img src="/makemyweb-mark.webp" alt="" width={35} height={18} />
            <span>Web creada por</span>{" "}
            <strong>makemyweb.es</strong>{" "}
            <span className="footer__credit-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
