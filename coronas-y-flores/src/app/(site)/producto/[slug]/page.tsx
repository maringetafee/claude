import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClockIcon, LeafIcon, LockIcon, TruckIcon } from "@/components/Icons";
import { AddToCart } from "@/components/shop/AddToCart";
import { Breadcrumbs } from "@/components/shop/PageHero";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductGrid } from "@/components/shop/ProductCard";
import { BRAND } from "@/lib/brand";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/env";
import { fromPriceCents, isSoldOut } from "@/lib/product-utils";
import { getSettings } from "@/lib/site-data";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  const title = product.seo_title || product.name;
  const description =
    product.seo_description || product.short_description || `${product.name} de ${BRAND.name}, floristería en ${BRAND.city}.`;
  const image = product.images[0];
  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: `${title} · ${BRAND.name}`,
      description,
      url: `/producto/${product.slug}`,
      images: image ? [{ url: image.url, alt: image.alt || product.name }] : undefined,
    },
  };
}

function latestSameDay(slots: { sameDayUntil: string | null }[]): string | null {
  const times = slots.map((s) => s.sameDayUntil).filter((t): t is string => Boolean(t));
  return times.length ? times.sort().at(-1)! : null;
}

export default async function ProductPage({ params }: Params) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const [related, settings] = await Promise.all([getRelatedProducts(product), getSettings()]);
  const cutoff = latestSameDay(settings.delivery.slots);
  const url = `${SITE_URL}/producto/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.short_description || product.description,
        image: product.images.map((i) => i.url),
        sku: product.slug,
        brand: { "@type": "Brand", name: BRAND.name },
        category: product.category?.name,
        offers: product.variants.length
          ? {
              "@type": "AggregateOffer",
              priceCurrency: "EUR",
              lowPrice: (fromPriceCents(product) / 100).toFixed(2),
              highPrice: (Math.max(...product.variants.map((v) => v.price_cents)) / 100).toFixed(2),
              offerCount: product.variants.length,
              availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              url,
            }
          : {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: (product.price_cents / 100).toFixed(2),
              availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              url,
              seller: { "@type": "Organization", name: BRAND.name },
            },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tienda", item: `${SITE_URL}/tienda` },
          ...(product.category
            ? [{ "@type": "ListItem", position: 3, name: product.category.name, item: `${SITE_URL}/tienda/${product.category.slug}` }]
            : []),
          { "@type": "ListItem", position: product.category ? 4 : 3, name: product.name, item: url },
        ],
      },
    ],
  };

  return (
    <main id="main" className="shop">
      <section className="pdp">
        <div className="container">
          <Breadcrumbs
            tone="ink"
            items={[
              { href: "/", label: "Inicio" },
              { href: "/tienda", label: "Tienda" },
              ...(product.category ? [{ href: `/tienda/${product.category.slug}`, label: product.category.name }] : []),
              { label: product.name },
            ]}
          />
          <div className="pdp__grid">
            <ProductGallery images={product.images} name={product.name} />
            <div>
              {product.category && <div className="eyebrow">{product.category.name}</div>}
              <h1 className="pdp__title">{product.name}</h1>
              {product.short_description && <p className="pdp__short">{product.short_description}</p>}
              <AddToCart
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price_cents: product.price_cents,
                  compare_at_cents: product.compare_at_cents,
                  stock: product.stock,
                  allow_ribbon: product.allow_ribbon,
                  image: product.images[0]?.url ?? null,
                  variants: product.variants,
                }}
              />
              <ul className="pdp__perks">
                <li>
                  <TruckIcon />
                  <span>Entrega a domicilio en {BRAND.city} y alrededores, o recogida en tienda.</span>
                </li>
                {cutoff && (
                  <li>
                    <ClockIcon />
                    <span>¿Lo necesitas hoy? Pídelo antes de las {cutoff} h y lo llevamos en el día.</span>
                  </li>
                )}
                <li>
                  <LeafIcon />
                  <span>Flor natural compuesta a mano. Según temporada podemos sustituir alguna flor por otra de igual calidad y estilo.</span>
                </li>
                <li>
                  <LockIcon />
                  <span>Pago 100% seguro con tarjeta, Apple Pay o Google Pay.</span>
                </li>
              </ul>
              {product.description && (
                <div className="pdp__desc prose">
                  <h2>Descripción</h2>
                  {product.description.split(/\n{2,}/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related">
          <div className="container">
            <div className="featured__head">
              <div>
                <div className="eyebrow">También te puede gustar</div>
                <h2 className="section-title">Más del taller</h2>
              </div>
            </div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
