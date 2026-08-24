import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
    >
      {/* the background photo already carries the iris/fibers — just a slow living glow on top */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[70vmin] w-[70vmin] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,191,255,0.14) 0%, rgba(22,135,184,0.06) 35%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mb-6 text-xs tracking-[0.4em] text-iris uppercase"
        >
          MAKEMYWEB
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-balance text-6xl leading-[0.98] tracking-tight text-marble sm:text-7xl lg:text-8xl"
        >
          Diseñamos tu <span className="text-iris">web</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-balance text-lg text-stone"
        >
          Sitios a medida, listos en 24/48h, sin líos técnicos ni sorpresas en
          el precio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#contacto"
            className="w-full rounded-full bg-iris px-8 py-4 text-sm tracking-wide text-charcoal transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Pide tu presupuesto
          </a>
          <a
            href="#presupuesto"
            className="w-full rounded-full border border-marble/25 px-8 py-4 text-sm tracking-wide text-marble transition-colors hover:border-marble/60 sm:w-auto"
          >
            Calcula el precio
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mx-auto mt-16 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs tracking-[0.15em] text-stone/70 uppercase"
        >
          <span>Diseño &amp; desarrollo a medida</span>
          <span className="h-1 w-1 rounded-full bg-stone/40" />
          <span>Páginas animadas 3D</span>
          <span className="h-1 w-1 rounded-full bg-stone/40" />
          <span>Mantenimiento y soporte</span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-marble/40 to-transparent" />
      </motion.div>
    </section>
  );
}
