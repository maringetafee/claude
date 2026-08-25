"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { pergolas } from "@/data/images";

export default function PergolasSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(
          imageRef.current,
          { scale: 1.15 },
          { scale: 1, duration: 1.4, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.current,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 1, delay: 0.25, ease: "power2.out" }
        );
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex h-[85vh] items-end overflow-hidden rounded-2xl bg-ink sm:h-[82vh]"
    >
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src={pergolas.bioclimatica2.src}
          alt={pergolas.bioclimatica2.alt}
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 w-full px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/60">
            Pérgolas
          </p>
          <h2 className="mt-4 font-display text-3xl leading-[1.05] text-paper sm:text-4xl lg:text-6xl">
            Espacios exteriores diseñados para disfrutarlos todo el año.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-paper/70 sm:text-base">
            Pérgolas con lona, de encanto clásico y versátil, y pérgolas
            bioclimáticas, con lamas ajustables que controlan la luz y la
            ventilación. Fabricadas a medida para particulares e
            instaladores profesionales.
          </p>
          <Link
            href="/pergolas"
            className="mt-6 inline-flex w-fit items-center gap-3 border border-paper/40 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Descubrir pérgolas
          </Link>
        </div>
      </div>
    </div>
  );
}
