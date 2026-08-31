import Image from "next/image";
import { stats } from "@/lib/config";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { Counter } from "@/components/motion/Counter";

export function About() {
  return (
    <section id="agencia" className="bg-paper py-section-y">
      <div className="container-edit grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="relative order-2 aspect-[4/5] overflow-hidden lg:order-1 lg:col-span-5">
          <Image
            src="https://images.unsplash.com/photo-1664463760781-f159dfe3af30?auto=format&fit=crop&q=80&w=1400"
            alt="Firma de la compraventa entre la agencia y los clientes"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <span className="mb-6 block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
            La agencia
          </span>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.1] text-ink text-balance">
            <LineReveal
              lines={[
                "Conocemos el valor",
                "de encontrar",
                "el lugar adecuado.",
              ]}
            />
          </h2>
          <Reveal delay={0.2} className="mt-8 max-w-lg">
            <p className="text-[1.05rem] leading-relaxed text-ink-soft">
              Doce años recorriendo Madrid Sur calle a calle nos han enseñado que
              cada operación tiene su propio ritmo. No trabajamos con
              volumen: trabajamos con las personas y las propiedades que
              elegimos representar, con la misma atención el primer día que
              el último.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <p className="font-serif text-[2.5rem] font-light leading-none text-ink">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-[0.78rem] uppercase tracking-[0.1em] text-stone">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
