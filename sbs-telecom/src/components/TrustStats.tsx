import { Reveal } from "./ui/Reveal";
import { company } from "@/lib/content";

const facts = [
  { value: String(company.vehicles), label: "Vehículos", detail: "Flota propia para atender toda la región" },
  { value: "Madrid", label: "Cobertura", detail: "Comunidad de Madrid" },
  { value: "Domingos", label: "Urgencias", detail: "09:00 — 14:00, averías generales" },
];

export function TrustStats() {
  return (
    <section className="relative border-y border-bone-100/10 bg-carbon-950 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal>
            <div className="flex items-end gap-4">
              <span className="font-display text-[9rem] leading-[0.8] font-bold tracking-[-0.04em] text-bone-100 sm:text-[11rem] lg:text-[13rem]">
                {company.foundedYears}+
              </span>
              <div className="mb-3 leading-tight sm:mb-6">
                <div className="mono-label text-sm text-signal-500">Años</div>
                <div className="max-w-[9rem] text-sm text-bone-500">de experiencia en telecomunicaciones</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-1 gap-8 border-t border-bone-100/10 pt-8 sm:grid-cols-3 lg:border-t-0 lg:pt-0">
              {facts.map((fact) => (
                <div key={fact.label} className="border-l border-bone-100/15 pl-5">
                  <dt className="mono-label text-[10px] text-bone-600">{fact.label}</dt>
                  <dd className="mt-2 font-display text-2xl font-semibold tracking-tight text-bone-100">
                    {fact.value}
                  </dd>
                  <dd className="mt-1 text-sm text-bone-500">{fact.detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
