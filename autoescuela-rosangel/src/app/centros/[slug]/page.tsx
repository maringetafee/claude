import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { centers, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import PermitsSection from "@/components/sections/PermitsSection";
import ContactSection from "@/components/sections/ContactSection";

export function generateStaticParams() {
  return centers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const center = centers.find((c) => c.slug === slug);
  if (!center) return {};
  return {
    title: `Autoescuela en ${center.zoneLabel} — ${center.street}`,
    description: `Autoescuela Rosangel en ${center.addressLine}. Teléfono, horario, cómo llegar y clases de permiso B y A2.`,
    alternates: { canonical: `/centros/${center.slug}/` },
  };
}

export default async function CenterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const center = centers.find((c) => c.slug === slug);
  if (!center) notFound();

  return (
    <main id="main">
      <section className="border-b border-line bg-paper pb-16 pt-28 sm:pt-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <Eyebrow>{center.zoneLabel}</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
                Autoescuela Rosangel — {center.zoneLabel}
              </h1>
              <p className="mt-4 max-w-md text-ink-soft">
                Clases de permiso B y A2 en {center.street}, Getafe.
              </p>

              <div className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
                <p className="flex items-start gap-2.5">
                  <PinIcon className="mt-0.5 shrink-0 text-stone" />
                  {center.addressLine}
                </p>
                <div className="flex items-start gap-2.5">
                  <ClockIcon className="mt-0.5 shrink-0 text-stone" />
                  <ul className="text-ink-soft">
                    {center.hours.map((h) => (
                      <li key={h.label}>
                        <span className="text-ink">{h.label}:</span> {h.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.mapsQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-paper"
                >
                  Cómo llegar
                </a>
                <a
                  href={center.phone.href}
                  className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-5 py-3 text-sm font-medium"
                >
                  <PhoneIcon className="h-4 w-4" /> Llamar
                </a>
                <a
                  href={whatsappHref(whatsappMessages.centerPrefix(center.zoneLabel), center.whatsapp.number)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-5 py-3 text-sm font-medium"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="min-h-[320px] overflow-hidden rounded-sm border border-line">
              <iframe
                title={`Mapa — ${center.fullName}`}
                src={center.mapEmbedUrl}
                loading="lazy"
                className="h-full min-h-[320px] w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>

      <PermitsSection />
      <ContactSection />
    </main>
  );
}
