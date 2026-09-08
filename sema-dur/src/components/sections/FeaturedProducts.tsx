import Link from "next/link";
import { featuredProducts } from "@/data/products";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import ProductCard from "@/components/commerce/ProductCard";
import Icon from "@/components/ui/Icon";

export default function FeaturedProducts() {
  const items = featuredProducts(8);
  return (
    <Section tone="soft" space="lg">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Selección"
            title="Herramientas destacadas"
            lead="Referencias habituales entre nuestros clientes. Añádelas a tu solicitud y te pasamos precio y plazo."
          />
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:gap-2.5 transition-[gap]"
          >
            Ver todo el catálogo
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
