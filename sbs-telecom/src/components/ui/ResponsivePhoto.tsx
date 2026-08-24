import type { CSSProperties } from "react";
import { imageWidths } from "@/lib/imageMeta";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

// Drop-in replacement for next/image's `fill` mode. The site runs with
// `images.unoptimized: true` (required for static export on Netlify), which means
// next/image never builds a srcSet — every viewport downloads the same full-size
// file. This builds a real srcSet from the pre-generated `-sm` variants instead.
export function ResponsivePhoto({ src, alt, sizes, className = "", style, priority }: Props) {
  const widths = imageWidths[src];
  const srcSet = widths ? `${src.replace(/\.jpg$/, "-sm.jpg")} ${widths.sm}w, ${src} ${widths.lg}w` : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={style}
    />
  );
}
