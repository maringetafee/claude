import { useMemo, type Dispatch, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import {
  calculatePricing,
  formatEUR,
  MAINTENANCE_SURCHARGE,
  type CalculatorState,
} from "../lib/pricing";

function AnimatedPrice({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={Math.round(value)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="inline-block tabular-nums"
      >
        {formatEUR(value)}
      </motion.span>
    </AnimatePresence>
  );
}

interface PriceCalculatorProps {
  state: CalculatorState;
  setState: Dispatch<SetStateAction<CalculatorState>>;
}

export function PriceCalculator({ state, setState }: PriceCalculatorProps) {
  const result = useMemo(() => calculatePricing(state), [state]);

  const update = <K extends keyof typeof state>(key: K, value: (typeof state)[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  return (
    <section
      id="presupuesto"
      className="relative px-6 py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            Presupuesto
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Calcula tu presupuesto en segundos
          </h2>
          <p className="mt-5 text-stone">
            Mueve las opciones y compara lo que cuesta con una agencia
            grande, un freelancer y con nosotros.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
          {/* Controls */}
          <Reveal className="space-y-10 rounded-2xl border border-marble/10 bg-charcoal/45 p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between rounded-xl border border-iris/30 bg-iris/[0.06] px-4 py-3 text-sm text-marble">
              <span>Diseño + desarrollo, de principio a fin</span>
              <span className="text-xs tracking-widest text-iris uppercase">
                Siempre incluido
              </span>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm tracking-wide text-marble/80">
                  Número de páginas
                </p>
                <span className="font-display text-xl text-iris">
                  {state.pages}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={state.pages}
                onChange={(e) => update("pages", Number(e.target.value))}
                className="w-full accent-iris"
              />
              <div className="mt-1 flex justify-between text-xs text-stone">
                <span>1</span>
                <span>5</span>
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm tracking-wide text-marble/80">
                Extras
              </p>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-marble/10 px-4 py-3 text-sm text-stone transition-colors hover:border-marble/25">
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="accent-iris"
                      checked={state.animated3d}
                      onChange={(e) => update("animated3d", e.target.checked)}
                    />
                    Página animada 3D (esta web es un ejemplo)
                  </span>
                  <span className="text-xs text-gold">+279 €</span>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-marble/10 px-4 py-3 text-sm text-stone transition-colors hover:border-marble/25">
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="accent-iris"
                      checked={state.bookingSystem}
                      onChange={(e) => update("bookingSystem", e.target.checked)}
                    />
                    Sistema de reservas
                  </span>
                  <span className="text-xs text-gold">+179 €</span>
                </label>
              </div>
              {state.bookingSystem && (
                <p className="mt-3 text-xs text-stone/70">
                  El sistema de reservas suma {formatEUR(MAINTENANCE_SURCHARGE)}
                  /mes al mantenimiento.
                </p>
              )}
              <p className="mt-4 text-xs text-stone/70">
                La ayuda con los contenidos y el SEO ya van incluidos en el
                precio, sin coste extra.
              </p>
            </div>
          </Reveal>

          {/* Results */}
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <div className="rounded-2xl border border-marble/10 bg-charcoal/40 p-6 backdrop-blur-sm">
              <p className="text-sm text-stone">
                Agencia típica cobra un mínimo de
              </p>
              <p className="mt-2 font-display text-3xl text-marble/60">
                <AnimatedPrice value={result.agency} />
              </p>
            </div>

            <div className="rounded-2xl border border-marble/10 bg-charcoal/40 p-6 backdrop-blur-sm">
              <p className="text-sm text-stone">
                Freelancer normal cobra un mínimo de
              </p>
              <p className="mt-2 font-display text-3xl text-marble/60">
                <AnimatedPrice value={result.freelancer} />
              </p>
            </div>

            <motion.div
              layout
              className="relative overflow-hidden rounded-2xl border border-iris/50 bg-gradient-to-b from-iris/25 to-charcoal/70 p-8 backdrop-blur-sm"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-electric/20 blur-3xl" />
              <p className="text-sm tracking-wide text-marble/80">
                Con MAKEMYWEB
              </p>
              <p className="mt-3 font-display text-5xl text-marble">
                <AnimatedPrice value={result.makemyweb} />
              </p>
              {result.extrasTotal > 0 && (
                <p className="mt-3 text-xs text-marble/50">
                  Base {formatEUR(result.makemywebBase)} + extras{" "}
                  {formatEUR(result.extrasTotal)}
                </p>
              )}
              <a
                href="#contacto"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-iris py-3.5 text-sm text-charcoal transition-transform hover:scale-[1.02]"
              >
                Pide tu presupuesto
              </a>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
