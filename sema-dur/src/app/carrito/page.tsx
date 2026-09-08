import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Section";
import CartView from "@/components/commerce/CartView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tu solicitud de presupuesto",
    description: "Revisa las herramientas de tu solicitud antes de pedir presupuesto.",
    path: "/carrito/",
    noindex: true,
  }),
};

export default function CartPage() {
  return (
    <Section space="md">
      <Container>
        <CartView />
      </Container>
    </Section>
  );
}
