import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import CentersSelector from "./CentersSelector";

export default function CentersSection({
  id = "centros",
  heading = "Elige tu centro",
}: {
  id?: string;
  heading?: string;
}) {
  return (
    <section id={id} className="border-b border-line bg-paper py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>Centros en Getafe</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-lg text-ink-soft">
            Tres centros repartidos por Getafe para que siempre tengas uno
            cerca: Centro, Norte y Manzana.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <CentersSelector />
        </Reveal>
      </Container>
    </section>
  );
}
