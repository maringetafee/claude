import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    num: "01",
    title: "Descubrimos",
    text: "Hablamos de tu negocio, tu público y lo que necesita tu web.",
  },
  {
    num: "02",
    title: "Diseñamos",
    text: "Maquetamos y definimos el estilo antes de escribir código.",
  },
  {
    num: "03",
    title: "Desarrollamos",
    text: "Código limpio, rápido y que se ve bien en cualquier pantalla.",
  },
  {
    num: "04",
    title: "Lanzamos",
    text: "Publicamos el sitio y seguimos cerca las primeras semanas.",
  },
];

export function Process() {
  return (
    <section id="proceso" className="px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            Proceso
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Cómo trabajamos
          </h2>
        </Reveal>

        <div className="relative mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <svg
            className="pointer-events-none absolute top-6 left-0 hidden h-px w-full lg:block"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="12%"
              y1="0"
              x2="88%"
              y2="0"
              stroke="#1687B8"
              strokeWidth="1"
              strokeDasharray="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </svg>

          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.12}>
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-iris/40 bg-charcoal font-display text-sm text-iris">
                  {step.num}
                </div>
                <h3 className="font-display text-xl text-marble">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
