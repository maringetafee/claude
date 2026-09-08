import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import CheckoutForm from "@/components/commerce/CheckoutForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solicitar presupuesto",
  description:
    "Envíanos tu solicitud de presupuesto. Te respondemos con precio, disponibilidad, plazo y gastos de envío para su aprobación.",
  path: "/checkout/",
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Solicitud"
        title="Solicitar presupuesto"
        lead="Cuéntanos a quién enviamos el presupuesto y a dónde. No se realiza ningún cargo ahora."
        breadcrumbs={[
          { name: "Inicio", href: "/" },
          { name: "Tu solicitud", href: "/carrito" },
          { name: "Presupuesto" },
        ]}
      />
      <Section space="md">
        <Container>
          <CheckoutForm />
        </Container>
      </Section>
    </>
  );
}
