import { company } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

export function Emergency() {
  return (
    <section id="urgencias" className="relative overflow-hidden bg-signal-950 py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-signal-500)_1px,transparent_1px),linear-gradient(90deg,var(--color-signal-500)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[auto_1fr_auto] lg:gap-14">
          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-signal-500" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-signal-500" />
            </span>
            <span className="mono-label text-sm text-signal-400">Urgencias</span>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-bone-100 sm:text-4xl">
              {company.emergency.day}, {company.emergency.hours}
            </h2>
            <p className="mt-2 text-signal-400/90">{company.emergency.scope} — atención directa, sin intermediarios.</p>
          </div>

          <a
            href={company.phoneHref}
            className="group flex items-center gap-3 self-center rounded-full border border-signal-500/40 bg-carbon-950/40 px-6 py-4 font-mono text-xl font-medium text-bone-100 transition-colors hover:border-signal-500 hover:bg-carbon-950/70 lg:text-2xl"
          >
            <PhoneIcon />
            {company.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-signal-500" aria-hidden>
      <path
        d="M4 3h3.2l1.3 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.3V16a2 2 0 0 1-2 2A13 13 0 0 1 2 5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
