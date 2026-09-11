import Image from "next/image";
import Link from "next/link";
import { formatEUR } from "@/lib/money";
import { fromPriceCents, hasPriceRange, isSoldOut } from "@/lib/product-utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const img = product.images[0];
  const soldOut = isSoldOut(product);
  const price = fromPriceCents(product);
  const onSale = !product.variants.length && product.compare_at_cents != null && product.compare_at_cents > product.price_cents;
  const href = `/producto/${product.slug}`;

  return (
    <article className={`product-card${soldOut ? " is-soldout" : ""}`}>
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
        ) : onSale ? (
          <span className="product-card__badge product-card__badge--rose">Oferta</span>
        ) : null}
      </Link>
      <div>
        {product.category && <div className="product-card__cat">{product.category.name}</div>}
        <Heading className="product-card__name">
          <Link href={href}>{product.name}</Link>
        </Heading>
        <div className="product-card__price">
          <span>
            {hasPriceRange(product) ? "Desde " : ""}
            {formatEUR(price)}
          </span>
          {onSale && <s>{formatEUR(product.compare_at_cents!)}</s>}
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
