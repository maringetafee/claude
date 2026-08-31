"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { PropertyImage } from "@/lib/types";

export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-line md:aspect-[16/8]">
        {images.map((img, i) => (
          <div
            key={img.src + i}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              i === active ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/50 to-transparent p-6">
          <p className="font-serif text-2xl font-light text-paper md:text-3xl">{title}</p>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 md:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden bg-line transition-opacity duration-300",
                active === i ? "opacity-100 ring-1 ring-ink" : "opacity-60 hover:opacity-90"
              )}
            >
              <Image src={img.src} alt={img.alt} fill sizes="16vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
