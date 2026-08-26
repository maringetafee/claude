import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { PhotoSlot } from '../content/media'
import { Photo } from './Photo'

type Props = {
  photos: PhotoSlot[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, photos.length, onClose, onNavigate])

  const photo = photos[index]

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ampliada: ${photo.alt}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] flex flex-col bg-night/97 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-sm text-on-night-muted">
          {index + 1} / {photos.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar imagen ampliada"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-on-night transition-colors hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 pb-6">
        <button
          type="button"
          aria-label="Imagen anterior"
          onClick={() => onNavigate((index - 1 + photos.length) % photos.length)}
          className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-on-night transition-colors hover:bg-white/10 sm:grid"
        >
          ←
        </button>

        <motion.div
          key={photo.src}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="max-h-full max-w-full"
        >
          <Photo {...photo} priority className="max-h-[75dvh] w-auto max-w-full rounded-lg object-contain" />
          <p className="mt-3 text-center text-sm text-on-night-muted">{photo.alt}</p>
        </motion.div>

        <button
          type="button"
          aria-label="Imagen siguiente"
          onClick={() => onNavigate((index + 1) % photos.length)}
          className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-on-night transition-colors hover:bg-white/10 sm:grid"
        >
          →
        </button>
      </div>
    </motion.div>
  )
}
