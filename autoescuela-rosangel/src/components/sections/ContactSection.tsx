import { centers, siteConfig, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Contacto</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              ¿Hablamos?
            </h2>
            <p className="mt-4 max-w-sm text-ink-soft">
              Cuéntanos qué carnet te interesa y te contactamos nosotros. Sin
              compromiso.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={whatsappHref(whatsappMessages.general)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-sm bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
              >
                <WhatsAppIcon className="h-4 w-4" /> Hablar por WhatsApp
              </a>
              <a
                href={siteConfig.phone.href}
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-signal"
              >
                <PhoneIcon className="h-4 w-4" /> {siteConfig.phone.display}
              </a>
            </div>

            <div className="mt-10 space-y-4 border-t border-line pt-6">
              {centers.map((c) => (
                <div key={c.slug} className="text-sm">
                  <p className="font-medium text-ink">{c.zoneLabel}</p>
                  <p className="text-ink-soft">{c.addressLine}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
