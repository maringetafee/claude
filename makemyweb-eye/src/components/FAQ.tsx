import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "¿Cuánto tarda un proyecto normal?",
    a: "En 24/48 horas si el proyecto es sencillo. Para webs con más páginas, contenidos o SEO, acordamos contigo el plazo exacto.",
  },
  {
    q: "¿Qué incluye el precio del presupuesto?",
    a: "Diseño, desarrollo, revisión en dispositivos móviles y una ronda de ajustes antes de publicar.",
  },
  {
    q: "¿Puedo pedir cambios cuando el sitio ya esté publicado?",
    a: "Sí. El plan Mantenimiento Básico incluye 1 cambio de contenido al mes (los siguientes a 15 €) y el plan Mantenimiento Pro incluye cambios ilimitados.",
  },
  {
    q: "¿El hosting y el dominio están incluidos?",
    a: "Sí, ambos están incluidos en los planes de cuidado mensual. También podemos configurarlo sobre tu propio hosting o dominio si ya los tienes.",
  },
  {
    q: "¿Y si necesito más páginas después de empezar?",
    a: "Ajustamos el presupuesto con el mismo precio por página que ya conoces desde el principio.",
  },
  {
    q: "¿Qué es el panel de gestión con base de datos?",
    a: "Un extra pensado para negocios sin sistema de reservas: te damos un panel privado donde puedes actualizar tú mismo el catálogo, precios, horarios u ofertas, sin tocar código ni escribirnos.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            FAQ
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Preguntas frecuentes
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-marble/10 border-y border-marble/10">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base text-marble sm:text-lg">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-2xl font-light text-iris"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-sm leading-relaxed text-stone">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
