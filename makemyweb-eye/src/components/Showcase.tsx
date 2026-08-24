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
    featured: true,
  },
  {
    name: "Lolita Café",
    place: "Getafe",
    kind: "Desayunos y brunch",
    eyebrow: "GETAFE · C. MAGDALENA 16",
    tagline: "Desayunos, brunch y platos healthy con producto fresco.",
    href: "https://lolitagetafe.netlify.app/",
    image: "/images/showcase/lolita.webp",
    featured: false,
  },
  {
    name: "Mocca Café",
    place: "Getafe",
    kind: "Brunch y poke bowls",
    eyebrow: "MOCCA CAFÉ · EST. GETAFE",
    tagline: "★★★★☆ 4,2 · +800 opiniones en Google.",
    href: "https://moccacafe.netlify.app/",
    image: "/images/showcase/mocca.webp",
    featured: false,
  },
  {
    name: "MAKEMYWEB",
    place: "Demo",
    kind: "Web animada 3D",
    eyebrow: "EJEMPLO · DISEÑO ANIMADO",
    tagline: "Otro ejemplo de web animada, con scroll cinematográfico en 3D.",
    href: "https://ejemplo-makemyweb.netlify.app/",
    image: "/images/showcase/makemyweb-demo.webp",
    featured: false,
  },
];

function ProjectCard({
  project,
  index,
  delay,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ clipPath: "inset(6% 0 6% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={project.featured ? "lg:col-span-12" : "lg:col-span-4"}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-lg bg-[#0d1418]"
      >
        <div
          className={`relative overflow-hidden ${
            project.featured
              ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]"
              : "aspect-[3/4] sm:aspect-[4/3]"
          }`}
        >
          <img
            src={project.image}
            alt={`Captura de la web de ${project.name}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/20 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-charcoal/70 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
            <span className="font-display text-sm text-marble/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] tracking-widest text-marble/70 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-[10px] tracking-[0.2em] text-iris/90">
              {project.eyebrow}
            </p>
            <p
              className={`font-display leading-tight text-warm-white ${
                project.featured ? "mt-2 text-3xl sm:text-4xl" : "mt-2 text-2xl"
              }`}
            >
              {project.name}
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <p className="line-clamp-2 max-w-md text-sm text-marble/75">
                {project.tagline}
              </p>
              <p className="shrink-0 text-xs whitespace-nowrap text-stone">
                {project.kind} · {project.place}
              </p>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export function Showcase() {
  return (
    <section id="trabajo" className="px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            Trabajo real
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Así lucen los sitios que creamos
          </h2>
          <p className="mt-5 max-w-lg text-stone">
            Cuatro webs ya publicadas: tres negocios reales y un ejemplo de
            diseño animado. Toca cualquiera para verla en vivo.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
