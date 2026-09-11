import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPermit, permits } from "@/data/permits";
import { whatsappHref, whatsappMessages } from "@/lib/site-config";
import { ArrowIcon, CheckIcon, WhatsAppIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

export function generateStaticParams() {
  return permits.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const permit = getPermit(slug);
  if (!permit) return {};
  return {
    title: permit.title,
    description: `${permit.subtitle} Infórmate sobre el ${permit.name} en Autoescuela Rosangel, Getafe.`,
    alternates: { canonical: `/permisos/${permit.slug}/` },
  };
}

const messageByCode = {
  B: whatsappMessages.permitB,
  A2: whatsappMessages.permitA2,
};

export default async function PermitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const permit = getPermit(slug);
  if (!permit) notFound();

  const tone = permit.code === "B" ? "signal" : "amber";

  return (
    <main id="main">
      <section className="border-b border-line bg-paper pb-16 pt-28 sm:pt-32">
        <Container className="max-w-3xl">
          <span
            className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
              tone === "signal" ? "bg-signal-soft text-signal-dark" : "bg-amber-soft text-amber-dark"
            }`}
          >
            Permiso {permit.code}
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
            {permit.name} en Getafe
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{permit.subtitle}</p>
          <p className="mt-2 text-sm text-stone">Edad mínima: {permit.minAge}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contacto/"
              className={`inline-flex items-center gap-2 rounded-sm px-6 py-3.5 text-sm font-semibold transition-colors ${
                tone === "signal"
                  ? "bg-signal text-paper hover:bg-signal-dark"
                  : "bg-amber text-ink hover:brightness-95"
              }`}
            >
              Quiero información
              <ArrowIcon />
            </Link>
            <a
              href={whatsappHref(messageByCode[permit.code])}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink"
            >
              <WhatsAppIcon className="h-4 w-4" /> Hablar por WhatsApp
            </a>
          </div>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-sm border border-line bg-paper-soft">
            <Image
              src={permit.image.src}
              alt={permit.image.alt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-paper-soft py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">¿Qué te permite conducir?</h2>
            <ul className="mt-5 space-y-3">
              {permit.canDrive.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckIcon className={`mt-0.5 shrink-0 ${tone === "signal" ? "text-signal" : "text-amber"}`} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display text-2xl font-bold">Requisitos</h2>
            <ul className="mt-5 space-y-3">
              {permit.requirements.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckIcon className={`mt-0.5 shrink-0 ${tone === "signal" ? "text-signal" : "text-amber"}`} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-paper py-16 sm:py-20">
        <Container>
          <Reveal>
            <Eyebrow>El proceso</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Cómo sacarte el {permit.name.toLowerCase()}
            </h2>
          </Reveal>

          <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {permit.process.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 50}>
                <span className="font-display text-sm font-bold text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{step.description}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200} className="mt-10 max-w-2xl border-t border-line pt-6">
            <h3 className="font-display text-lg font-bold">Sobre el examen</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {permit.examInfo.map((info) => (
                <li key={info}>· {info}</li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <FaqSection />
      <ContactSection />
    </main>
  );
}
