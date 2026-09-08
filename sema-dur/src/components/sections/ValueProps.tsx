import { Container, Section, SectionHeading } from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

const props: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "wrench",
    title: "Herramienta a medida",
    body: "Estudiamos perfil, material y máquina para construir la herramienta que resuelve el trabajo, a partir de plano, DXF o una muestra de la pieza.",
  },
  {
    icon: "sparkle",
    title: "Filo de diamante (PCD)",
    body: "Fuimos pioneros en aplicar el diamante policristalino al corte de la madera. Multiplica los metros entre afilados en materiales abrasivos.",
  },
  {
    icon: "shield",
    title: "Reafilado que alarga la vida",
    body: "Recuperamos el filo y la geometría original de tu herramienta —también de otras marcas— varias veces antes de reponerla.",
  },
  {
    icon: "check",
    title: "Asesoramiento técnico",
    body: "Un equipo cualificado y maquinaria automática de última generación detrás de cada pedido, con presupuesto y plazo claros.",
  },
];

export default function ValueProps() {
  return (
    <Section space="lg">
      <Container>
        <SectionHeading
          eyebrow="Por qué Sema-Dur"
          title="Fabricante, no solo distribuidor"
          lead="Trabajamos la herramienta de principio a fin: diseño, fabricación, ajuste y reafilado."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
          {props.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 60}
              className="flex flex-col gap-3 bg-white p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-brand-tint)] text-[var(--color-brand)]">
                <Icon name={p.icon} size={20} />
              </span>
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
