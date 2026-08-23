import { company } from "@/lib/content";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-carbon-950 py-28 lg:py-40">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]" viewBox="0 0 1440 600" fill="none" aria-hidden preserveAspectRatio="xMidYMid slice">
        <path d="M-40 500 L400 500 L480 420 L1000 420 L1080 340 L1480 340" stroke="var(--color-bone-400)" strokeWidth="1" />
        <path d="M-40 120 L360 120 L440 200 L900 200 L980 120 L1480 120" stroke="var(--color-signal-500)" strokeWidth="1" strokeOpacity="0.5" />
      </svg>

      <div className="relative mx-auto max-w-[1400px] px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-balance font-display text-[12vw] font-bold leading-[0.98] tracking-[-0.03em] text-bone-100 sm:text-6xl lg:text-7xl">
            ¿Tienes una instalación que necesita atención?
          </h2>
          <p className="mx-auto mt-7 max-w-md text-balance text-lg text-bone-500">Cuéntanos qué necesitas.</p>

          <div className="mt-11 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button href="#contacto">
              Solicitar presupuesto
              <ArrowIcon />
            </Button>
            <a href={company.phoneHref} className="font-mono text-lg text-bone-300 transition-colors hover:text-signal-400">
              {company.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0" aria-hidden>
      <path d="M3 7.5H12M12 7.5L8 3.5M12 7.5L8 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
