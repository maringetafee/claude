import Link from "next/link";
import type { Product } from "@/data/products";
import { categoryName } from "@/data/products";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";
import Price from "@/components/ui/Price";
import AddToQuoteButton from "./AddToQuoteButton";

export default function ProductCard({
  product,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px",
}: {
  product: Product;
  sizes?: string;
}) {
  const href = `/producto/${product.slug}/`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-line-strong)] hover:shadow-[var(--shadow-md)]">
      <Link
        href={href}
        className="relative block overflow-hidden bg-[var(--color-bg-steel)]"
        aria-label={product.name}
      >
        <div className="aspect-[4/3] overflow-hidden">
          {product.image ? (
            <Picture
              image={product.image}
              alt={product.name}
              sizes={sizes}
              aspectRatio="4 / 3"
              position={product.imagePosition}
              className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
          ) : (
            <span className="grid h-full place-items-center text-[var(--color-line-strong)]">
              <Icon name="wrench" size={40} />
            </span>
          )}
        </div>
        {product.kind === "servicio" ? (
          <span className="absolute left-3 top-3 rounded-[var(--radius-xs)] bg-[var(--color-ink)] px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-wide text-white">
            Servicio
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
            {categoryName(product.categorySlug)}
          </span>
          <h3 className="text-[0.98rem] font-semibold leading-snug">
            <Link
              href={href}
              className="after:absolute after:inset-0 hover:text-[var(--color-brand)]"
            >
              {product.name}
            </Link>
          </h3>
          <span className="text-xs text-[var(--color-ink-muted)]">
            Ref. {product.ref}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-snug text-[var(--color-ink-soft)]">
          {product.summary}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
            <Price product={product} size="sm" />
            <AvailabilityBadge availability={product.availability} />
          </div>
          <div className="relative z-10 flex gap-2">
            <AddToQuoteButton
              product={product}
              size="sm"
              full
              label="Añadir"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
