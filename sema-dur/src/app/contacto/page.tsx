import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/Icon";
import ContactSection from "@/components/sections/ContactSection";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contacta con Talleres Sema-Dur en Humanes de Madrid. Teléfono 91 615 05 48, WhatsApp 635 942 064, administracion@sema-dur.com.",
  path: "/contacto/",
});

export default function ContactoPage() {
  const { address } = siteConfig;
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Contacto", path: "/contacto/" },
        ])}
      />
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu herramienta"
        lead="Estamos encantados de atenderte para resolver consultas y preparar pedidos. Cuéntanos qué necesitas cortar y en qué máquina."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Contacto" }]}
      />

      <Section space="md">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-8">
            <ul className="flex flex-col gap-5">
              <ContactItem icon="phone" label="Teléfono">
                <a href={siteConfig.phone.href} className="hover:text-[var(--color-brand)]">
                  {siteConfig.phone.display}
                </a>
              </ContactItem>
              <ContactItem icon="whatsapp" label="WhatsApp / móvil">
                <a
                  href={siteConfig.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-brand)]"
                >
                  {siteConfig.whatsapp.display}
                </a>
              </ContactItem>
              <ContactItem icon="mail" label="Email">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-[var(--color-brand)]"
                >
                  {siteConfig.email}
                </a>
              </ContactItem>
              <ContactItem icon="pin" label="Dirección">
                {address.full}
              </ContactItem>
              <ContactItem icon="clock" label="Horario">
                {siteConfig.hours}
              </ContactItem>
            </ul>

            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
              <iframe
                title="Ubicación de Talleres Sema-Dur en Humanes de Madrid"
                src="https://www.google.com/maps?q=Talleres%20Sema%20Dur%20SL,%20Av.%20de%20las%20Flores%207,%20Humanes%20de%20Madrid&output=embed"
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6 sm:p-8">
            <h2 className="mb-1 font-display text-xl font-bold">Escríbenos</h2>
            <p className="mb-6 text-sm text-[var(--color-ink-soft)]">
              Te respondemos lo antes posible en horario laboral.
            </p>
            <ContactSection
              formName="contacto"
              submitLabel="Enviar consulta"
              messageLabel="Tu consulta"
              messageHint="Indícanos referencias, material, máquina o el trabajo que quieres hacer."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-brand-tint)] text-[var(--color-brand)]">
        <Icon name={icon} size={18} />
      </span>
      <span className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {label}
        </span>
        <span className="text-[var(--color-ink)]">{children}</span>
      </span>
    </li>
  );
}
