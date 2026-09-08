import { Container, Section } from "@/components/ui/Section";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <Section tone="soft" space="md">
      <Container>
        <h2 className="text-2xl font-bold">También te puede interesar</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
