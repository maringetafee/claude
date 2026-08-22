import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { useCountUp } from "../hooks/useCountUp";

const PROJECTS = [
  {
    name: "La Esquinita",
    place: "Getafe",
    kind: "Bar de tapas",
    eyebrow: "CAFÉ · CAÑAS · VINOS · TAPAS",
    tagline: "El rincón de tapas de siempre en el corazón de Getafe.",
    href: "https://esquinita.netlify.app/",
    bg: "#efe9da",
    fg: "#211d16",
    accent: "#b79a5a",
  },
  {
    name: "Lolita Café",
    place: "Getafe",
    kind: "Desayunos y brunch",
    eyebrow: "GETAFE · C. MAGDALENA 16",
    tagline: "Desayunos, brunch y platos healthy con producto fresco.",
    href: "https://lolitagetafe.netlify.app/",
    bg: "#f6efe6",
    fg: "#2a1f1a",
    accent: "#e0568f",
  },
  {
    name: "Mocca Café",
    place: "Getafe",
    kind: "Brunch y poke bowls",
    eyebrow: "MOCCA CAFÉ · EST. GETAFE",
    tagline: "★★★★☆ 4,2 · +800 opiniones en Google.",
    href: "https://moccacafe.netlify.app/",
    bg: "#2a1e14",
    fg: "#f3ead9",
    accent: "#c99a4a",
  },
];

const STATS = [
  { value: 134, suffix: "", label: "proyectos entregados" },
  { value: 4.8, suffix: "/5", label: "valoración media de clientes", decimals: 1 },
  { value: 48, suffix: "h", label: "plazo medio de entrega", prefix: "24/" },
  { value: 89, suffix: "%", label: "renueva el mantenimiento" },
];

function Stat({
  value,
  suffix,
  prefix,
  label,
  decimals,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}) {
  const { ref, value: animated } = useCountUp(value);
  return (
    <div className="text-center">
      <p className="font-display text-4xl text-marble sm:text-5xl">
        {prefix}
        <span ref={ref}>
          {decimals ? animated.toFixed(decimals) : Math.round(animated)}
        </span>
        {suffix}
      </p>
      <p className="mt-2 text-sm text-stone">{label}</p>
    </div>
  );
}

export function Showcase() {
  return (
    <section className="px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            Trabajo real
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Así lucen los sitios que creamos
          </h2>
          <p className="mt-5 text-stone">
            Tres bares y cafeterías reales, con web ya publicada. Toca
            cualquiera para verla en vivo.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.12}>
              <motion.a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35 }}
                className="group block overflow-hidden rounded-2xl border border-marble/10 bg-[#16181c] shadow-2xl shadow-black/40"
              >
                <div className="flex items-center gap-2 border-b border-marble/10 bg-[#1c1e23] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] tracking-wide text-stone opacity-0 transition-opacity group-hover:opacity-100">
                    Ver sitio en vivo
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17L17 7M17 7H9M17 7V15"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div
                  className="flex h-56 flex-col justify-center gap-3 p-6"
                  style={{ background: project.bg, color: project.fg }}
                >
                  <p
                    className="text-[10px] tracking-[0.2em] opacity-70"
                    style={{ color: project.accent }}
                  >
                    {project.eyebrow}
                  </p>
                  <p className="font-display text-2xl leading-tight">
                    {project.name}
                  </p>
                  <p className="text-xs leading-relaxed opacity-70">
                    {project.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm text-marble/80">{project.name}</p>
                  <p className="text-xs text-stone">
                    {project.kind} · {project.place}
                  </p>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-24 grid grid-cols-2 gap-10 border-t border-marble/10 pt-16 lg:grid-cols-4">
            {STATS.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
