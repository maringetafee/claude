import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const pillars = [
  {
    number: "01",
    title: "Acceso preferente",
    body: "Muchas de nuestras propiedades cambian de manos antes de llegar al mercado abierto.",
  },
  {
    number: "02",
    title: "Criterio, no volumen",
    body: "Trabajamos una cartera reducida para dedicar a cada operación el tiempo que merece.",
  },
  {
    number: "03",
    title: "Un solo interlocutor",
    body: "La misma persona te acompaña desde la primera visita hasta la firma en notaría.",
  },
];

export function ValueProps() {
  return (
    <section className="bg-paper-dim py-section-y">
      <div className="container-edit">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3.25rem)] font-light leading-[1.15] text-ink text-balance">
              <LineReveal
                lines={[
                  "No vendemos metros cuadrados.",
                  "Ayudamos a decidir dónde",
                  "va a pasar la vida.",
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.05rem] leading-relaxed text-ink-soft">
              Cada propiedad que representamos pasa por un filtro exigente,
              antes de fotografía y antes de precio. Es la razón por la que
              nuestros clientes vuelven, y por la que se lo cuentan a alguien
              más.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-20 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-12 md:grid-cols-3">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.number}>
              <span className="font-serif text-sm text-accent">
                {pillar.number}
              </span>
              <h3 className="mt-4 font-serif text-xl font-light text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-stone">
                {pillar.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
