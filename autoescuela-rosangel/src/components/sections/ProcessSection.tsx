import { generalProcess } from "@/data/process";
import { whatsappHref, whatsappMessages } from "@/lib/site-config";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

export default function ProcessSection() {
  return (
    <section id="proceso" className="border-b border-line bg-ink py-20 text-paper sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow tone="amber">Cómo funciona</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            De cero a tu carnet, paso a paso.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {generalProcess.map((step, i) => (
            <Reveal as="li" key={step.number} delay={i * 60}>
              <span className="font-display text-lg font-bold text-signal">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={200}>
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-paper/15 pt-8">
            <p className="text-paper/70">¿Prefieres que te lo contemos directamente?</p>
            <a
              href={whatsappHref(whatsappMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-sm bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper/90"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
