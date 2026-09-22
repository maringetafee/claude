import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClockIcon, GiftIcon, HeartIcon, LeafIcon, LockIcon, TruckIcon } from "@/components/Icons";
import { AddToCart } from "@/components/shop/AddToCart";
import { Breadcrumbs } from "@/components/shop/PageHero";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductGrid } from "@/components/shop/ProductCard";
import { BRAND } from "@/lib/brand";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { fillTemplate, resolveProductTexts } from "@/lib/content-shared";
import { formatDateLong } from "@/lib/delivery";
import { SITE_URL } from "@/lib/env";
import { activeDiscount, applyDiscount, fromPriceCents, isSoldOut } from "@/lib/product-utils";
import { getSettings, getSiteContent } from "@/lib/site-data";
import type { PerkIcon } from "@/lib/types";

const PERK_ICONS: Record<PerkIcon, typeof TruckIcon> = {
  truck: TruckIcon,
  clock: ClockIcon,
  leaf: LeafIcon,
  lock: LockIcon,
  gift: GiftIcon,
  heart: HeartIcon,
};

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
  const [related, settings, content] = await Promise.all([getRelatedProducts(product), getSettings(), getSiteContent()]);
  const cutoff = latestSameDay(settings.delivery.slots);
  const url = `${SITE_URL}/producto/${product.slug}`;
  const texts = resolveProductTexts(content.product, product.texts);
  const discount = activeDiscount(product);
  const perks = texts.perks
    .map((p) => ({ icon: PERK_ICONS[p.icon] ?? LeafIcon, text: fillTemplate(p.text, { hora: cutoff }) }))
    .filter((p): p is { icon: typeof TruckIcon; text: string } => Boolean(p.text?.trim()));
  const saleUntil =
    discount > 0 && product.sale_ends_on ? fillTemplate(texts.saleUntil, { fecha: formatDateLong(product.sale_ends_on).replace(/^[^,]+, /, "") }) : null;
  const priceValidUntil = discount > 0 && product.sale_ends_on ? product.sale_ends_on : undefined;

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
              lowPrice: (applyDiscount(fromPriceCents(product), discount) / 100).toFixed(2),
              highPrice: (applyDiscount(Math.max(...product.variants.map((v) => v.price_cents)), discount) / 100).toFixed(2),
              offerCount: product.variants.length,
              availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              url,
            }
          : {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: (applyDiscount(product.price_cents, discount) / 100).toFixed(2),
              priceValidUntil,
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
              {discount > 0 && (
                <div className="pdp__sale">
                  <span className="sale-tag sale-tag--inline">
                    <strong>-{discount}%</strong>
                    <span>{product.sale_label.trim() || "Oferta"}</span>
                  </span>
                  {saleUntil && <span className="pdp__sale-until">{saleUntil}</span>}
                </div>
              )}
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
                  discountPercent: discount,
                }}
                texts={texts}
              />
              {perks.length > 0 && (
                <ul className="pdp__perks">
                  {perks.map(({ icon: Icon, text }, i) => (
                    <li key={i}>
                      <Icon />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              )}
              {product.description && (
                <div className="pdp__desc prose">
                  <h2>{texts.descriptionTitle}</h2>
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
                <div className="eyebrow">{texts.relatedEyebrow}</div>
                <h2 className="section-title">{texts.relatedTitle}</h2>
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
