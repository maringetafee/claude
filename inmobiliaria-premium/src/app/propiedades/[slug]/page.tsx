import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/properties";
import { formatArea, formatPrice } from "@/lib/format";
import { osmEmbedUrl } from "@/lib/geo";
import { PropertyGallery } from "@/components/PropertyGallery";
import { PropertyGrid } from "@/components/sections/PropertyGrid";
import { ContactForm } from "@/components/ContactForm";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title: property.title,
    description: property.description,
    openGraph: {
      title: `${property.title} — ${siteConfig.name}`,
      description: property.description,
      images: [{ url: property.cover.src }],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property);

  return (
    <div className="pb-section-y">
      <div className="pt-20 md:pt-24">
        <PropertyGallery images={property.gallery} title={property.title} />
      </div>

      <div className="container-edit mt-12">
        <Link
          href="/propiedades"
          className="mb-8 inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.14em] text-stone hover:text-ink"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M13.5 5H0.5M0.5 5L5 0.5M0.5 5L5 9.5" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          Volver a propiedades
        </Link>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="block text-[0.72rem] font-medium uppercase tracking-[0.2em] text-stone">
                    {property.zone}, {property.city} · {property.category}
                  </span>
                  <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] font-light leading-tight text-ink text-balance">
                    {property.title}
                  </h1>
                  <p className="mt-4 font-serif text-2xl text-accent">
                    {formatPrice(property.price, property.priceSuffix)}
                  </p>
                </div>
                <FavoriteButton propertyId={property.id} tone="solid" className="shrink-0" />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-6">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-stone">Habitaciones</p>
                <p className="mt-1 font-serif text-xl text-ink">{property.beds}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-stone">Baños</p>
                <p className="mt-1 font-serif text-xl text-ink">{property.baths}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-stone">Superficie</p>
                <p className="mt-1 font-serif text-xl text-ink">{formatArea(property.area)}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-stone">Operación</p>
                <p className="mt-1 font-serif text-xl text-ink">
                  {property.operation === "venta" ? "Venta" : "Alquiler"}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <h2 className="font-serif text-2xl font-light text-ink">Descripción</h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
                {property.description}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <h2 className="font-serif text-2xl font-light text-ink">Características</h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[0.95rem] text-ink-soft">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.25} className="mt-10">
              <h2 className="font-serif text-2xl font-light text-ink">Ubicación</h2>
              <div className="mt-5 aspect-[16/9] w-full overflow-hidden border border-line grayscale">
                <iframe
                  title={`Mapa de ${property.zone}`}
                  src={osmEmbedUrl(property.zone)}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <Reveal delay={0.15}>
                <ContactForm
                  title="Solicitar información"
                  subtitle="Un asesor te contactará para concertar una visita."
                  propertyId={property.id}
                  propertyTitle={property.title}
                  propertyReference={property.reference}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div className="container-edit mt-24">
        <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-light text-ink">
          Propiedades similares
        </h2>
        <div className="mt-10">
          <PropertyGrid properties={similar} />
        </div>
      </div>
    </div>
  );
}
