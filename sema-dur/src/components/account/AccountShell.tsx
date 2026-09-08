import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import { accountNav } from "@/lib/site-config";

export default function AccountShell({
  title,
  active,
  children,
}: {
  title: string;
  active: string;
  children: React.ReactNode;
}) {
  const nav = [{ label: "Resumen", href: "/cuenta" }, ...accountNav];
  return (
    <>
      <PageHero
        eyebrow="Mi cuenta"
        title={title}
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Mi cuenta", href: "/cuenta" }, { name: title }]}
      />
      <Section space="md">
        <Container className="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="Secciones de la cuenta" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex flex-col gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active === n.href ? "page" : undefined}
                    className={`block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors ${
                      active === n.href
                        ? "bg-[var(--color-brand-tint)] text-[var(--color-brand-strong)]"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-soft)]"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>{children}</div>
        </Container>
      </Section>
    </>
  );
}
