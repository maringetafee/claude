import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { FavoriteButton } from "@/components/FavoriteButton";

interface PropertyCardProps {
  property: Property;
  size?: "large" | "medium" | "small";
  priority?: boolean;
}

const sizes: Record<NonNullable<PropertyCardProps["size"]>, string> = {
  large: "aspect-[4/5] md:aspect-[16/11]",
  medium: "aspect-[4/5]",
  small: "aspect-[4/5]",
};

export function PropertyCard({
  property,
  size = "medium",
  priority = false,
}: PropertyCardProps) {
  return (
    <Link href={`/propiedades/${property.slug}`} className="group block">
      <div className={cn("relative overflow-hidden bg-line", sizes[size])}>
        <Image
          src={property.cover.src}
          alt={property.cover.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        <span className="absolute left-5 top-5 border border-paper/60 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-paper backdrop-blur-[2px]">
          {property.operation === "venta" ? "En venta" : "En alquiler"}
        </span>

        <FavoriteButton propertyId={property.id} className="absolute right-5 top-5 z-10" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-6">
          <div className="text-paper">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-paper/75">
              {property.zone}, {property.city}
            </p>
            <h3 className="mt-1.5 font-serif text-xl font-light leading-tight md:text-2xl">
              {property.title}
            </h3>
            <p className="mt-2 text-[0.95rem] font-medium">
              {formatPrice(property.price, property.priceSuffix)}
            </p>
          </div>
          <span className="mb-1 shrink-0 translate-x-0 text-paper opacity-0 transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:opacity-100">
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <path
                d="M0.5 7H21.5M21.5 7L15 0.5M21.5 7L15 13.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[0.78rem] text-stone">
        <span>{property.beds} hab.</span>
        <span aria-hidden className="h-1 w-1 rounded-full bg-line" />
        <span>{property.baths} baños</span>
        <span aria-hidden className="h-1 w-1 rounded-full bg-line" />
        <span>{formatArea(property.area)}</span>
      </div>
    </Link>
  );
}
