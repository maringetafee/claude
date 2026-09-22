import Image from "next/image";
import Link from "next/link";
import { formatEUR } from "@/lib/money";
import { activeDiscount, fromPriceCents, hasPriceRange, isSoldOut, priceFor } from "@/lib/product-utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const img = product.images[0];
  const soldOut = isSoldOut(product);
  const { price, compareAt, percent } = priceFor(product, fromPriceCents(product));
  const saleLabel = activeDiscount(product) > 0 ? product.sale_label.trim() : "";
  const href = `/producto/${product.slug}`;

  return (
    <article className={`product-card${soldOut ? " is-soldout" : ""}${compareAt ? " is-onsale" : ""}`}>
      <Link href={href} className="product-card__media" tabIndex={-1} aria-hidden="true">
        {img && (
          <Image
            src={img.url}
            alt={img.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw"
          />
        )}
        {soldOut ? (
          <span className="product-card__badge">Agotado</span>
        ) : compareAt ? (
          <span className="sale-tag">
            {percent ? <strong>-{percent}%</strong> : null}
            <span>{saleLabel || "Oferta"}</span>
          </span>
        ) : null}
      </Link>
      <div>
        {product.category && <div className="product-card__cat">{product.category.name}</div>}
        <Heading className="product-card__name">
          <Link href={href}>{product.name}</Link>
        </Heading>
        <div className="product-card__price">
          <span className={compareAt ? "is-sale" : undefined}>
            {hasPriceRange(product) ? "Desde " : ""}
            {formatEUR(price)}
          </span>
          {compareAt && (
            <s>
              <span className="sr-only">Antes </span>
              {formatEUR(compareAt)}
            </s>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, headingLevel }: { products: Product[]; headingLevel?: "h2" | "h3" }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
