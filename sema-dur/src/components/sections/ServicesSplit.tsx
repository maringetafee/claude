import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";

const services = [
  {
    href: "/servicios/reafilado",
    title: "Reafilado y reacondicionado",
    body: "Devolvemos el filo y los ángulos de corte originales a fresas, cuchillas, sierras y herramienta de PCD. Presupuesto por herramienta según su estado.",
    image: "catalogo/fresas" as const,
  },
  {
    href: "/servicios/fabricacion-a-medida",
    title: "Fabricación a medida",
    body: "Diseñamos y fabricamos la herramienta especial para tu perfil y tu máquina: portacuchillas, fresas de eje o grupos de perfilar combinados.",
    image: "catalogo/fabricacion" as const,
  },
];

export default function ServicesSplit() {
  return (
    <Section tone="ink" space="lg">
      <Container>
        <span className="eyebrow text-[var(--color-accent)]">Servicios</span>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-[2.4rem]">
          Dos formas de mantener tu producción cortando
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] transition-colors hover:border-white/25"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <Picture
                  image={s.image}
                  alt=""
                  sizes="(max-width: 768px) 92vw, 560px"
                  aspectRatio="16 / 9"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-6">
                <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-ink-invert-soft)]">
                  {s.body}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)]">
                  Más información
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
