import Image from "next/image";
import Link from "next/link";
import { zones } from "@/lib/config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export function Zones() {
  return (
    <section className="bg-paper-dim py-section-y">
      <div className="container-edit">
        <SectionHeading
          eyebrow="Dónde trabajamos"
          lines={["Donde conocemos", "cada rincón"]}
          subtitle="Cuatro barrios que conocemos casa por casa, portal por portal — no solo sobre el papel."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {zones.map((zone, i) => (
            <Reveal key={zone.slug} delay={i * 0.1}>
              <Link
                href={`/propiedades?zona=${encodeURIComponent(zone.name)}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-line">
                  <Image
                    src={zone.image.src}
                    alt={zone.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <p className="text-[0.66rem] font-medium uppercase tracking-[0.16em] text-paper/75">
                      {zone.propertiesCount} propiedades
                    </p>
                    <h3 className="mt-1.5 font-serif text-2xl font-light text-paper">
                      {zone.name}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-stone">
                  {zone.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
