import { company } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { ResponsivePhoto } from "./ui/ResponsivePhoto";

const fleetImages = [
  { src: "/images/flota-1.jpg", alt: "Vehículos de S.B.S Telecomunicaciones estacionados junto a las oficinas" },
  { src: "/images/flota-2.jpg", alt: "Flota de vehículos rotulados de S.B.S Telecomunicaciones" },
];

export function Fleet() {
  const loop = [...fleetImages, ...fleetImages];

  return (
    <section className="relative overflow-hidden border-y border-bone-100/10 bg-carbon-900 py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="mono-label text-[11px] text-signal-500">Flota</span>
            <h2 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
              Una infraestructura preparada para responder.
            </h2>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-display text-6xl font-bold leading-none tracking-tight text-bone-100">
              {company.vehicles}
            </span>
            <span className="mono-label pb-1.5 text-xs text-bone-500">
              Vehículos
              <br />propios
            </span>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <div className="flex w-max animate-marquee gap-5 px-6 motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto lg:px-10">
          {loop.map((img, i) => {
            const isDuplicate = i >= fleetImages.length;
            return (
              <div
                key={`${img.src}-${i}`}
                aria-hidden={isDuplicate}
                className={`grain relative h-[220px] w-[340px] shrink-0 overflow-hidden rounded-sm bg-carbon-800 sm:h-[260px] sm:w-[400px] ${
                  isDuplicate ? "motion-reduce:hidden" : ""
                }`}
              >
                <ResponsivePhoto
                  src={img.src}
                  alt={isDuplicate ? "" : img.alt}
                  sizes="400px"
                  className="object-cover"
                  style={{ filter: "grayscale(0.35) contrast(1.1) brightness(0.85)" }}
                />
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-carbon-900 to-transparent lg:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-carbon-900 to-transparent lg:w-32" />
      </div>
    </section>
  );
}
