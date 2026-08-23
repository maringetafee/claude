import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const PLANS = [
  {
    name: "Mantenimiento Básico",
    price: "39",
    featured: false,
    icon: "shield" as const,
    features: [
      "Hosting y dominio incluidos",
      "Copias de seguridad semanales",
      "Actualizaciones de seguridad",
      "1 cambio de contenido al mes incluido",
      "Los siguientes cambios a 15 €",
      "1 hora de soporte al mes",
    ],
  },
  {
    name: "Mantenimiento Pro",
    tag: "Más elegido",
    price: "77",
    featured: true,
    icon: "shield-check" as const,
    features: [
      "Todo lo de Mantenimiento Básico",
      "Cambios de contenido ilimitados",
      "Soporte prioritario",
      "Revisión SEO continua",
    ],
  },
];

function PlanIcon({ type }: { type: "shield" | "shield-check" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5l6.5 2.6v5.2c0 4.6-3 7.7-6.5 8.7-3.5-1-6.5-4.1-6.5-8.7V6.1L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {type === "shield-check" && (
        <path
          d="M9 12.2l2 2 4-4.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function Maintenance() {
  return (
    <section id="mantenimiento" className="px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            Mantenimiento
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Después del lanzamiento, seguimos cuidando tu web
          </h2>
          <p className="mt-5 text-stone">
            Hosting, dominio, copias de seguridad y soporte para que no
            tengas que pensar en ello.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                className={`relative h-full overflow-hidden rounded-2xl border p-8 backdrop-blur-sm ${
                  plan.featured
                    ? "border-iris/40 bg-gradient-to-b from-iris/[0.14] to-charcoal/40"
                    : "border-marble/10 bg-charcoal/35"
                }`}
              >
                {plan.featured && (
                  <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-electric/20 blur-3xl" />
                )}

                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                      plan.featured
                        ? "border-gold/40 bg-gold/[0.08] text-gold"
                        : "border-iris/40 bg-charcoal text-iris"
                    }`}
                  >
                    <PlanIcon type={plan.icon} />
                  </div>
                  {plan.tag && (
                    <span className="inline-block rounded-full border border-gold/40 px-3 py-1 text-[11px] tracking-widest text-gold uppercase">
                      {plan.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-2xl text-marble">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-marble">
                    {plan.price}€
                  </span>
                  <span className="text-sm text-stone">/mes</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-stone"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-iris" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full py-3 text-sm transition-colors ${
                    plan.featured
                      ? "bg-iris text-charcoal hover:scale-[1.02]"
                      : "border border-marble/20 text-marble/80 hover:border-iris/50"
                  }`}
                >
                  Elegir plan
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
