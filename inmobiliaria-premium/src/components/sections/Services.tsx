"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/lib/config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function Services() {
  const [active, setActive] = useState(0);
  const activeService = services[active];

  return (
    <section id="servicios" className="bg-paper py-section-y">
      <div className="container-edit">
        <SectionHeading
          eyebrow="Lo que hacemos"
          lines={["Servicios a la medida", "de cada operación"]}
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <ul className="lg:col-span-7">
            {services.map((service, i) => (
              <li
                key={service.number}
                onMouseEnter={() => setActive(i)}
                className="group border-b border-line first:border-t"
              >
                <Link
                  href={service.href}
                  className="flex items-center gap-6 py-7 md:gap-10 md:py-9"
                >
                  <span className="font-serif text-sm text-stone transition-colors duration-300 group-hover:text-accent">
                    {service.number}
                  </span>
                  <span className="flex-1 font-serif text-[clamp(1.6rem,3.5vw,2.75rem)] font-light text-ink transition-transform duration-500 ease-out group-hover:translate-x-2">
                    {service.title}
                  </span>
                  <span className="hidden shrink-0 -translate-x-2 text-ink opacity-0 transition-all duration-400 ease-out group-hover:translate-x-0 group-hover:opacity-100 md:block">
                    <svg width="26" height="16" viewBox="0 0 26 16" fill="none">
                      <path
                        d="M0.5 8H25.5M25.5 8L18 0.5M25.5 8L18 15.5"
                        stroke="currentColor"
                        strokeWidth="1.1"
                      />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative hidden aspect-[4/5] overflow-hidden bg-line lg:col-span-5 lg:block">
            {services.map((service, i) => (
              <div
                key={service.number}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-out",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  priority={i === 0}
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 to-transparent" />
            <p className="absolute bottom-0 left-0 right-0 p-6 text-[0.95rem] leading-relaxed text-paper">
              {activeService.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
