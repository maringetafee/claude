"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/config";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }

  return (
    <section className="bg-ink py-section-y text-paper">
      <div className="container-edit">
        <span className="mb-14 block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-paper/60">
          Lo que dicen quienes ya confiaron en nosotros
        </span>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-1">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <p className="max-w-3xl font-serif text-[clamp(1.6rem,3.5vw,2.75rem)] font-light leading-[1.25] text-balance">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-4 text-[0.85rem] text-paper/70">
                  <span className="font-medium text-paper">{current.name}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-paper/40" />
                  <span>{current.operation}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-paper/40" />
                  <span>{current.zone}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="flex items-end justify-between lg:col-span-3 lg:flex-col lg:items-end lg:justify-end lg:gap-8">
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  aria-label={`Ver testimonio ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-px w-8 transition-colors duration-300",
                    i === index ? "bg-paper" : "bg-paper/30"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-4">
              <button
                aria-label="Testimonio anterior"
                onClick={() => go(-1)}
                className="flex h-10 w-10 items-center justify-center border border-paper/30 text-paper transition-colors duration-300 hover:border-paper"
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M13.5 5H0.5M0.5 5L5 0.5M0.5 5L5 9.5" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </button>
              <button
                aria-label="Testimonio siguiente"
                onClick={() => go(1)}
                className="flex h-10 w-10 items-center justify-center border border-paper/30 text-paper transition-colors duration-300 hover:border-paper"
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M0.5 5H13.5M13.5 5L9 0.5M13.5 5L9 9.5" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
