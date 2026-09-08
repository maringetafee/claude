import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/Icon";
import AccessForms from "@/components/account/AccessForms";
import { accountNav } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mi cuenta",
  description: "Accede a tu cuenta de cliente de Sema-Dur o regístrate.",
  path: "/cuenta/",
  noindex: true,
});

export default function CuentaPage() {
  return (
    <>
      <PageHero
        eyebrow="Mi cuenta"
        title="Área de cliente"
        lead="Consulta tus solicitudes de presupuesto y guarda tus datos para agilizar próximos pedidos."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Mi cuenta" }]}
      />

      <Section space="md">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-display text-xl font-bold">Acceso rápido</h2>
            <ul className="flex flex-col gap-2">
              {accountNav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white px-4 py-3.5 font-medium transition-colors hover:border-[var(--color-brand)]"
                  >
                    {n.label}
                    <Icon name="chevron-right" size={16} className="text-[var(--color-ink-muted)]" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2.5 text-sm text-[var(--color-ink-muted)]">
              <Icon name="shield" size={15} className="mt-0.5 shrink-0" />
              <span>
                Tus solicitudes y datos se guardan solo en este navegador
                mientras no exista una cuenta con acceso. Nada se envía a
                servidores de terceros.
              </span>
            </div>
          </div>

          <AccessForms />
        </Container>
      </Section>
    </>
  );
}
