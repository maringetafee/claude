"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div className="pdp__gallery">
      <div className="pdp__main">
        {current && (
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 55vw"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="pdp__thumbs" role="group" aria-label="Fotos del producto">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`pdp__thumb${i === index ? " is-active" : ""}`}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <Image src={img.url} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
