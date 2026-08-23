import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const PROJECTS = [
  {
    name: "La Esquinita",
    place: "Getafe",
    kind: "Bar de tapas",
    eyebrow: "CAFÉ · CAÑAS · VINOS · TAPAS",
    tagline: "El rincón de tapas de siempre en el corazón de Getafe.",
    href: "https://esquinita.netlify.app/",
    image: "/images/showcase/esquinita.webp",
    accent: "#b79a5a",
  },
  {
    name: "Lolita Café",
    place: "Getafe",
    kind: "Desayunos y brunch",
    eyebrow: "GETAFE · C. MAGDALENA 16",
    tagline: "Desayunos, brunch y platos healthy con producto fresco.",
    href: "https://lolitagetafe.netlify.app/",
    image: "/images/showcase/lolita.webp",
    accent: "#e0568f",
  },
  {
    name: "Mocca Café",
    place: "Getafe",
    kind: "Brunch y poke bowls",
    eyebrow: "MOCCA CAFÉ · EST. GETAFE",
    tagline: "★★★★☆ 4,2 · +800 opiniones en Google.",
    href: "https://moccacafe.netlify.app/",
    image: "/images/showcase/mocca.webp",
    accent: "#c99a4a",
  },
];

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

                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Captura de la web de ${project.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p
                      className="text-[10px] tracking-[0.2em] opacity-80"
                      style={{ color: project.accent }}
                    >
                      {project.eyebrow}
                    </p>
                    <p className="font-display text-2xl leading-tight text-warm-white">
                      {project.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <p className="text-sm text-marble/80">{project.tagline}</p>
                  <p className="shrink-0 text-xs text-stone">
                    {project.kind} · {project.place}
                  </p>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
