"use client";

import { useState } from "react";
import Image from "next/image";
import { services } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

export function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="servicios" className="relative bg-carbon-950 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mb-14 lg:mb-20">
          <span className="mono-label text-[11px] text-signal-500">Servicios</span>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
            Ocho especialidades. Una sola infraestructura.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* List */}
          <ul className="border-t border-bone-100/10">
            {services.map((service, i) => {
              const isActive = i === active;
              return (
                <li key={service.slug} className="border-b border-bone-100/10">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={isActive}
                    className="group flex w-full items-center gap-5 py-5 text-left transition-colors sm:gap-8 sm:py-6"
                  >
                    <span
                      className={`font-mono text-xs transition-colors ${
                        isActive ? "text-signal-500" : "text-bone-600"
                      }`}
                    >
                      {service.code}
                    </span>
                    <span
                      className={`font-display flex-1 text-xl font-semibold tracking-tight transition-all duration-300 sm:text-2xl lg:text-[1.7rem] ${
                        isActive ? "translate-x-1.5 text-bone-100" : "text-bone-600 group-hover:text-bone-400"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span
                      className={`hidden shrink-0 text-sm text-bone-600 transition-opacity duration-300 sm:inline ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {service.short}
                    </span>
                    <ArrowIcon
                      className={`hidden shrink-0 transition-all duration-300 sm:block ${
                        isActive ? "translate-x-0 opacity-100 text-signal-500" : "-translate-x-2 opacity-0"
                      }`}
                    />
                  </button>

                  {/* Mobile inline detail */}
                  <div
                    className={`overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] sm:hidden ${
                      isActive ? "grid grid-rows-[1fr] pb-6" : "grid grid-rows-[0fr]"
                    }`}
                    style={{ display: "grid" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ServiceDetail service={service} compact />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Visual panel — desktop only */}
          <div className="relative hidden sm:block">
            <div className="sticky top-28">
              <div className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon-800">
                {services.map((service, i) => (
                  <Image
                    key={service.slug}
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className={`object-cover transition-opacity duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ filter: "grayscale(0.4) contrast(1.1) brightness(0.75)" }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="mono-label text-[10px] text-signal-500">{current.code} / 08</span>
                  <p className="mt-3 max-w-sm text-balance text-bone-200">{current.description}</p>
                </div>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                {current.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-bone-500">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetail({ service, compact }: { service: (typeof services)[number]; compact?: boolean }) {
  return (
    <div className={compact ? "space-y-4" : ""}>
      <div className="grain relative aspect-[16/10] overflow-hidden rounded-sm bg-carbon-800">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "grayscale(0.4) contrast(1.1) brightness(0.75)" }}
        />
      </div>
      <p className="text-sm text-bone-400">{service.description}</p>
      <ul className="grid grid-cols-1 gap-2">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-bone-500">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
