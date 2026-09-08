import Link from "next/link";
import type { Category } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";

export default function CategoryCard({
  category,
  featured = false,
}: {
  category: Category;
  featured?: boolean;
}) {
  const count = productsInCategory(category.slug).length;
  return (
    <Link
      href={`/productos/${category.slug}/`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-invert)] text-white ${
        featured ? "min-h-[19rem] sm:col-span-2" : "min-h-[15rem]"
      }`}
    >
      <div className="absolute inset-0">
        {category.image ? (
          <Picture
            image={category.image}
            alt=""
            sizes={featured ? "(max-width: 640px) 90vw, 640px" : "(max-width: 640px) 90vw, 320px"}
            className="h-full w-full"
            aspectRatio={featured ? "16 / 12" : "16 / 11"}
            position={category.imagePosition}
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-[rgba(8,19,31,0.9)] via-[rgba(8,19,31,0.4)] to-transparent transition-opacity duration-300 group-hover:from-[rgba(8,19,31,0.95)]" />
      </div>

      <div className="relative z-10 flex flex-col gap-1.5 p-5">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {count} {count === 1 ? "referencia" : "referencias"}
        </span>
        <h3 className={`mt-1 font-display font-bold leading-tight ${featured ? "text-2xl" : "text-lg"}`}>
          {category.shortName}
        </h3>
        <p className={`text-sm text-white/75 ${featured ? "max-w-md" : "line-clamp-2"}`}>
          {category.claim}
        </p>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          Ver familia
          <Icon
            name="arrow-right"
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
