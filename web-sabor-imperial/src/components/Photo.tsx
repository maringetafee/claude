import type { PhotoSlot } from '../content/media'

type Props = PhotoSlot & {
  className?: string
  priority?: boolean
  sizes?: string
}

/** Thin wrapper so every <img> on the site gets consistent lazy-loading,
 * decoding hints, and responsive srcSet/sizes wiring from media.ts. */
export function Photo({ src, srcSet, alt, focus = 'center', className, priority = false, sizes }: Props) {
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      style={{ objectPosition: focus }}
      className={className}
    />
  )
}
