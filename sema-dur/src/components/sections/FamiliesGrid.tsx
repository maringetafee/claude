import { categories } from "@/data/categories";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import CategoryCard from "@/components/commerce/CategoryCard";
import Reveal from "@/components/ui/Reveal";

export default function FamiliesGrid() {
  return (
    <Section space="lg">
      <Container>
        <SectionHeading
          eyebrow="Catálogo"
          title="Cinco familias de herramienta"
          lead="Cada familia responde a un tipo de corte y de máquina. Entra en la que necesitas o pídenos una herramienta especial."
        />
        <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} featured={i === 0} />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
