import Link from "next/link";
import { ProductGrid } from "@/components/shop/ProductCard";
import type { Category, Product } from "@/lib/types";

export function CatalogView({
  categories,
  products,
  activeSlug,
}: {
  categories: Category[];
  products: Product[];
  activeSlug: string | null;
}) {
  return (
    <section className="section shop" style={{ paddingTop: 70 }}>
      <div className="container">
        {categories.length > 0 && (
          <nav className="chip-nav" aria-label="Categorías">
            <Link href="/tienda" className={`chip${activeSlug === null ? " is-active" : ""}`} aria-current={activeSlug === null ? "page" : undefined}>
              Todo
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/tienda/${c.slug}`}
                className={`chip${activeSlug === c.slug ? " is-active" : ""}`}
                aria-current={activeSlug === c.slug ? "page" : undefined}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}
        {products.length ? (
          <ProductGrid products={products} headingLevel="h2" />
        ) : (
          <div className="empty">
            <h2>Estamos preparando la tienda</h2>
            <p>Muy pronto podrás pedir aquí nuestros ramos y composiciones. Mientras tanto, llámanos y te lo preparamos.</p>
            <Link className="btn btn--ink" href="/#visitanos">
              Ver contacto
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
