import { siteConfig } from "@/lib/config";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

export function ContactSection() {
  return (
    <section id="contacto" className="bg-paper-dim py-section-y">
      <div className="container-edit grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <span className="mb-6 block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
            Contacto
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-ink text-balance">
            <LineReveal lines={["Hablemos de tu", "próximo paso."]} />
          </h2>
          <Reveal delay={0.2} className="mt-8 space-y-3 text-[0.98rem] text-ink-soft">
            <p>{siteConfig.address}</p>
            <p>
              <a href={`tel:${siteConfig.phone}`} className="hover:text-ink">
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
                {siteConfig.email}
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <ContactForm
            variant="general"
            title="Cuéntanos qué buscas"
            subtitle="Un asesor te contactará en menos de 24 horas."
          />
        </Reveal>
      </div>
    </section>
  );
}
