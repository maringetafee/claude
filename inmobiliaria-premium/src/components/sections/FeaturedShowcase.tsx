"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function FeaturedShowcase({ featuredProperty }: { featuredProperty: Property }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.12, 1]);

  const cover = featuredProperty.showcaseCover ?? featuredProperty.cover;

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-ink">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/40" />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="container-edit pb-16 md:pb-24">
          <Reveal y={14} duration={0.7}>
            <span className="mb-6 block text-[0.72rem] font-medium uppercase tracking-[0.28em] text-paper/80">
              Propiedad destacada
            </span>
          </Reveal>

          <h2 className="max-w-2xl font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] font-light leading-[1.02] text-paper text-balance">
            <LineReveal lines={[featuredProperty.title]} />
          </h2>

          <Reveal delay={0.25} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-paper/85">
            <span className="text-[0.95rem]">
              {featuredProperty.zone}, {featuredProperty.city}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-paper/50 md:block" />
            <span className="font-serif text-xl">
              {formatPrice(featuredProperty.price)}
            </span>
          </Reveal>

          <Reveal delay={0.4} className="mt-10">
            <Button href={`/propiedades/${featuredProperty.slug}`} variant="light">
              Descubrir propiedad
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
