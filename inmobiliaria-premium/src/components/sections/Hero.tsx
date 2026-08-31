"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LineReveal } from "@/components/motion/LineReveal";
import { Button } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-10 -bottom-10 h-[calc(100%+5rem)]"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={reduceMotion ? { scale: 1 } : { scale: 1.06 }}
          transition={{ duration: 22, ease: "linear" }}
          className="relative h-full w-full"
        >
          <Image
            src="/hero-cover.jpg"
            alt="Villa contemporánea al atardecer, con piscina iluminada"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/45"
      />

      <motion.div style={{ opacity }} className="relative z-10 flex h-full flex-col justify-end">
        <div className="container-edit pb-16 md:pb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mb-6 block text-[0.72rem] font-medium uppercase tracking-[0.3em] text-paper/80"
          >
            Inmo Retail · Getafe
          </motion.span>

          <h1 className="max-w-4xl font-serif text-[clamp(2.75rem,8vw,6.25rem)] font-light leading-[0.98] text-paper text-balance">
            <LineReveal
              lines={["Espacios que", "cuentan", "historias."]}
              delay={0.65}
              stagger={0.13}
              trigger="mount"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35, ease: EASE }}
            className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-paper/85"
          >
            Compra, venta y alquiler de propiedades en el sur de Madrid, con
            el criterio de quien conoce cada calle que recomienda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.55, ease: EASE }}
            className="mt-10"
          >
            <Button href="/propiedades" variant="light">
              Ver propiedades
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2, ease: EASE }}
        className="absolute bottom-8 right-[var(--section-x)] z-10 hidden items-center gap-3 text-paper/70 md:flex"
      >
        <span className="text-[0.68rem] uppercase tracking-[0.24em]">Descubrir</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px bg-paper/50"
        />
      </motion.div>
    </section>
  );
}
