"use client";

import { useState } from "react";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import type { ImageKey } from "@/components/ui/Picture";

export default function ProductGallery({
  images,
  name,
}: {
  images: ImageKey[];
  name: string;
}) {
  const list = images.length ? images : [];
  const [active, setActive] = useState(0);

  if (list.length === 0) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-steel)] text-[var(--color-line-strong)]">
        <Icon name="wrench" size={56} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white">
        <Picture
          image={list[active]}
          alt={`${name} — imagen ${active + 1}`}
          sizes="(max-width: 1024px) 92vw, 560px"
          priority
          aspectRatio="4 / 3"
        />
      </div>
      {list.length > 1 ? (
        <ul className="flex gap-2.5">
          {list.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-pressed={i === active}
                className={`h-16 w-16 overflow-hidden rounded-[var(--radius-sm)] border transition-colors ${
                  i === active
                    ? "border-[var(--color-brand)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-line-strong)]"
                }`}
              >
                <Picture image={img} alt="" sizes="64px" aspectRatio="1 / 1" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
