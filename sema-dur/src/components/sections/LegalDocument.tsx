import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/Icon";
import type { LegalDoc } from "@/data/legal";
import { siteConfig } from "@/lib/site-config";

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero
        eyebrow="Información legal"
        title={doc.title}
        lead={doc.description}
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: doc.title }]}
      />
      <Section space="md">
        <Container className="max-w-3xl">
          <div className="mb-8 flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-warning)]/30 bg-[color-mix(in_oklab,var(--color-warning),white_90%)] px-4 py-3.5 text-sm text-[var(--color-ink-soft)]">
            <Icon name="file" size={16} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
            <p>
              Este documento está pendiente de sus textos legales definitivos.
              Mientras tanto, mostramos los datos identificativos verificados y el
              índice de contenidos que recogerá. Para cualquier consulta sobre el
              tratamiento de tus datos, escríbenos a{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-medium underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>

          {doc.facts ? (
            <>
              <h2 className="mb-3 text-lg font-bold">Datos identificativos</h2>
              <dl className="mb-8 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
                {doc.facts.map((f, i) => (
                  <div
                    key={f.label}
                    className={`grid grid-cols-[35%_65%] gap-3 px-4 py-3 text-sm ${
                      i % 2 ? "bg-[var(--color-bg-soft)]" : "bg-white"
                    }`}
                  >
                    <dt className="font-medium">{f.label}</dt>
                    <dd className="text-[var(--color-ink-soft)]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          <h2 className="mb-3 text-lg font-bold">Contenidos de este documento</h2>
          <ol className="flex flex-col gap-2">
            {doc.outline.map((item, i) => (
              <li key={i} className="flex gap-3 text-[var(--color-ink-soft)]">
                <span className="font-display font-bold text-[var(--color-ink-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
