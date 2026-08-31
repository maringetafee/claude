import Image from "next/image";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section id="contacto" className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&q=80&w=2400"
        alt="Casa moderna con grandes ventanales al atardecer"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.98] text-paper text-balance">
          <LineReveal
            lines={["Encuentra", "tu próximo", "lugar."]}
            className="text-center"
          />
        </h2>

        <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button href="/propiedades" variant="light">
            Ver propiedades
          </Button>
          <Button href="/#contacto-form" variant="ghost" className="!text-paper hover:!border-paper">
            Hablar con un asesor
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
