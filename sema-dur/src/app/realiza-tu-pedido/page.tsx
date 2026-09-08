import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/Icon";
import { Input } from "@/components/ui/Field";
import ContactSection from "@/components/sections/ContactSection";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Realiza tu pedido",
  description:
    "Rellena el formulario con tus referencias y realiza tu pedido directamente. Nos pondremos en contacto contigo lo antes posible.",
  path: "/realiza-tu-pedido/",
});

const steps = [
  "Indica las referencias o describe la herramienta que necesitas.",
  "Añade cantidades, material y datos de tu máquina si los tienes.",
  "Recibirás confirmación con precio, plazo y forma de envío.",
];

export default function RealizaTuPedidoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Realiza tu pedido", path: "/realiza-tu-pedido/" },
        ])}
      />
      <PageHero
        eyebrow="Pedidos"
        title="Realiza tu pedido"
        lead="Para comodidad de nuestros clientes habituales, puedes hacer tu pedido directamente desde aquí. Si prefieres armar la lista visualmente, usa el catálogo y la solicitud de presupuesto."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Realiza tu pedido" }]}
      />

      <Section space="md">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl font-bold">Cómo funciona</h2>
            <ol className="flex flex-col gap-4">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-brand)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[var(--color-ink-soft)]">{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2.5 text-sm text-[var(--color-ink-muted)]">
              <Icon name="quote" size={15} className="mt-0.5 shrink-0" />
              <span>
                ¿Prefieres seleccionar productos del catálogo? Usa la{" "}
                <Link
                  href="/productos"
                  className="font-medium text-[var(--color-brand)] underline"
                >
                  búsqueda por familias
                </Link>{" "}
                y envía la solicitud desde el carrito.
              </span>
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-bold">Datos del pedido</h2>
            <ContactSection
              formName="pedido"
              submitLabel="Enviar pedido"
              messageLabel="Detalle del pedido"
              messageHint="Referencias, cantidades, material, máquina, dirección de envío…"
              extraFields={
                <Input
                  label="Referencias principales"
                  name="referencias"
                  hint="Ej.: PC-AL, FR-COMP, CU-PERF…"
                />
              }
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
