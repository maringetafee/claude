"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function AddToQuoteButton({
  product,
  qty = 1,
  variant,
  size = "md",
  full = false,
  label = "Añadir a la solicitud",
  onAdded,
}: {
  product: Product;
  qty?: number;
  variant?: Record<string, string>;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  label?: string;
  onAdded?: () => void;
}) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  return (
    <Button
      type="button"
      size={size}
      className={full ? "w-full" : ""}
      aria-live="polite"
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          ref: product.ref,
          categorySlug: product.categorySlug,
          image: product.image,
          kind: product.kind,
          variant,
          qty,
        });
        setDone(true);
        onAdded?.();
        window.setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? (
        <>
          <Icon name="check" size={17} /> Añadido
        </>
      ) : (
        <>
          <Icon name="plus" size={17} /> {label}
        </>
      )}
    </Button>
  );
}
