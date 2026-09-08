import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  products,
  getProduct,
  relatedProducts,
  categoryName,
} from "@/data/products";
import { categoriesBySlug } from "@/data/categories";
import { Container, Section } from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";
import Icon from "@/components/ui/Icon";
import JsonLd from "@/components/ui/JsonLd";
import ProductGallery from "@/components/commerce/ProductGallery";
import ProductPurchase from "@/components/commerce/ProductPurchase";
import RelatedProducts from "@/components/commerce/RelatedProducts";
import { ButtonLink } from "@/components/ui/Button";
import { pageMetadata, productLd, breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} · ${categoryName(product.categorySlug)}`,
    description: product.summary,
    path: `/producto/${product.slug}/`,
    image: product.image,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoriesBySlug[product.categorySlug];
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: category?.shortName ?? "Catálogo", href: `/productos/${product.categorySlug}/` },
    { name: product.name },
  ];
  const related = relatedProducts(product, 3);
  const images = product.image ? [product.image] : [];

  return (
    <>
      <JsonLd
        data={[
          productLd(product),
          breadcrumbLd(
            crumbs.map((c) => ({ name: c.name, path: c.href ?? `/producto/${product.slug}/` })),
          ),
        ]}
      />

      <Section space="sm">
        <Container>
          <Breadcrumbs items={crumbs} className="mb-8" />

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <ProductGallery images={images} name={product.name} />
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Link
                  href={`/productos/${product.categorySlug}/`}
                  className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]"
                >
                  {categoryName(product.categorySlug)}
                </Link>
                <h1 className="font-display text-3xl font-bold leading-tight sm:text-[2.4rem]">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-ink-muted)]">
                  <span>Ref. de catálogo {product.ref}</span>
                  <AvailabilityBadge availability={product.availability} />
                </div>
              </div>

              <p className="leading-relaxed text-[var(--color-ink-soft)]">
                {product.description}
              </p>

              <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-5">
                <ProductPurchase product={product} />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-ink-soft)]">
                <span className="flex items-center gap-1.5">
                  <Icon name="phone" size={15} className="text-[var(--color-brand)]" />
                  Dudas técnicas: <Link href="/contacto" className="font-medium text-[var(--color-brand)] underline">contáctanos</Link>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section space="md" tone="soft">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Características</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[var(--color-ink-soft)]">
                  <Icon
                    name="check"
                    size={17}
                    className="mt-0.5 shrink-0 text-[var(--color-accent-strong)]"
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">Especificaciones</h2>
            <dl className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white">
              {product.specs.map((s, i) => (
                <div
                  key={s.label}
                  className={`grid grid-cols-[40%_60%] gap-3 px-4 py-3 text-sm ${
                    i % 2 ? "bg-[var(--color-bg-soft)]" : ""
                  }`}
                >
                  <dt className="font-medium text-[var(--color-ink)]">{s.label}</dt>
                  <dd className="text-[var(--color-ink-soft)]">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
              Los parámetros marcados «a definir» se concretan al preparar el
              presupuesto según tu aplicación y tu máquina.
            </p>
          </div>
        </Container>
      </Section>

      <Section space="sm">
        <Container>
          <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Icon name="wrench" size={22} className="mt-0.5 shrink-0 text-[var(--color-brand)]" />
              <div>
                <h2 className="text-lg font-semibold">¿Necesitas una variante especial?</h2>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  Fabricamos esta herramienta con el perfil, el diámetro y el
                  material que requiera tu trabajo.
                </p>
              </div>
            </div>
            <ButtonLink href="/servicios/fabricacion-a-medida" variant="outline">
              Fabricación a medida
            </ButtonLink>
          </div>

          {product.datasheet ? (
            <a
              href={product.datasheet}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] underline"
            >
              <Icon name="file" size={16} />
              Descargar ficha técnica (PDF)
            </a>
          ) : null}
        </Container>
      </Section>

      <RelatedProducts products={related} />
    </>
  );
}
