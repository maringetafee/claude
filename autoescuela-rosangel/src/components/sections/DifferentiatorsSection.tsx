import { differentiators } from "@/data/differentiators";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import SectionNumber from "@/components/ui/SectionNumber";

export default function DifferentiatorsSection() {
  return (
    <section className="border-b border-line bg-paper py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-xl">
          <Eyebrow>Por qué Rosangel</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            Lo que más repiten nuestros alumnos
          </h2>
          <p className="mt-4 text-ink-soft">
            No son eslóganes: son los rasgos que más se repiten en las
            opiniones públicas de quienes han pasado por Rosangel.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 60} className="border-t border-line pt-5">
              <SectionNumber n={String(i + 1).padStart(2, "0")} />
              <h3 className="mt-2 font-display text-lg font-bold">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
