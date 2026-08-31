import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

interface PropertyListRowProps {
  property: Property;
  active?: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

export function PropertyListRow({ property, active, onHover, onSelect }: PropertyListRowProps) {
  return (
    <Link
      href={`/propiedades/${property.slug}`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(property.id);
        }
      }}
      className={cn(
        "group flex gap-4 border-b border-line py-4 transition-colors duration-300",
        active ? "bg-paper-dim" : "hover:bg-paper-dim"
      )}
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-line">
        <Image
          src={property.cover.src}
          alt={property.cover.alt}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-stone">
          {property.operation === "venta" ? "En venta" : "En alquiler"} · {property.zone}
        </p>
        <p className="mt-1 truncate font-serif text-base font-light leading-tight text-ink">
          {property.title}
        </p>
        <p className="mt-1.5 text-[0.88rem] font-medium text-ink">
          {formatPrice(property.price, property.priceSuffix)}
        </p>
        <p className="mt-1 text-[0.72rem] text-stone">
          {property.beds} hab. · {property.baths} baños · {formatArea(property.area)}
        </p>
      </div>
    </Link>
  );
}
