import type { Metadata } from "next";
import Link from "next/link";
import { centers } from "@/lib/site-config";
import { ArrowIcon, PinIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import CentersSection from "@/components/sections/CentersSection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Centros en Getafe",
  description:
    "Los tres centros de Autoescuela Rosangel en Getafe: Titulcia, Rigoberta Menchú (Norte) y Manzana. Dirección, teléfono, horario y cómo llegar.",
  alternates: { canonical: "/centros/" },
};

export default function CentrosPage() {
  return (
    <main id="main">
      <section className="border-b border-line bg-paper pb-14 pt-28 sm:pt-32">
        <Container className="max-w-2xl">
          <Eyebrow>Autoescuela Getafe</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
            Nuestros centros en Getafe
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Tres centros para que siempre tengas uno cerca, elijas la zona
            que elijas de la ciudad.
          </p>
        </Container>
      </section>

      <CentersSection heading="Elige tu centro" />

      <section className="border-b border-line bg-paper py-16 sm:py-20">
        <Container className="grid gap-6 sm:grid-cols-3">
          {centers.map((c) => (
            <Link
              key={c.slug}
              href={`/centros/${c.slug}/`}
              className="group flex flex-col justify-between rounded-sm border border-line p-6 transition-colors hover:border-ink/30"
            >
              <div>
                <PinIcon className="text-signal" />
                <h2 className="mt-3 font-display text-xl font-bold">{c.zoneLabel}</h2>
                <p className="mt-1 text-sm text-ink-soft">{c.addressLine}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                Ver ficha del centro
                <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </Container>
      </section>

      <ContactSection />
    </main>
  );
}
