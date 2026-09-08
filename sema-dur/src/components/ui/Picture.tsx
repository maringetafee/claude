import manifest from "@/data/image-manifest.json";

export type ImageKey = keyof typeof manifest;

type PictureProps = {
  image: ImageKey;
  alt: string;
  /** `sizes` attribute — how wide the image renders at each breakpoint. */
  sizes?: string;
  /** LCP image: eager + fetchpriority=high, no lazy. */
  priority?: boolean;
  className?: string;
  /** Override the rendered aspect ratio (e.g. crop a wide photo to a card). */
  aspectRatio?: string;
  /** object-position when the intrinsic ratio differs from the box. */
  position?: string;
  loading?: "eager" | "lazy";
};

const BASE = "/images";

export default function Picture({
  image,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  aspectRatio,
  position,
  loading,
}: PictureProps) {
  const entry = manifest[image];
  const { w, h, widths, ext } = entry as {
    w: number;
    h: number;
    widths: number[];
    ext: string;
  };
  const srcset = (fmt: string) =>
    widths.map((width) => `${BASE}/${image}-${width}.${fmt} ${width}w`).join(", ");

  return (
    <picture
      className={className}
      style={
        aspectRatio
          ? { aspectRatio, display: "block", overflow: "hidden" }
          : undefined
      }
    >
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`${BASE}/${image}.${ext}`}
        width={w}
        height={h}
        alt={alt}
        decoding="async"
        loading={loading ?? (priority ? "eager" : "lazy")}
        fetchPriority={priority ? "high" : undefined}
        style={{
          width: "100%",
          height: aspectRatio ? "100%" : "auto",
          objectFit: aspectRatio ? "cover" : undefined,
          objectPosition: position,
        }}
      />
    </picture>
  );
}

export function largestSrc(image: ImageKey): string {
  const entry = manifest[image] as { widths: number[] };
  return `${BASE}/${image}-${entry.widths[entry.widths.length - 1]}.webp`;
}
