import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gallery } from '../content/restaurant'
import { photosById } from '../content/media'
import { Photo } from './Photo'
import { Lightbox } from './Lightbox'

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const photos = gallery.map((g) => photosById[g.id])

  return (
    <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brick">Galería</p>
        <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">El salón y los platos</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {gallery.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-square overflow-hidden rounded-xl bg-hairline-soft"
            aria-label={`Ampliar foto: ${item.label}`}
          >
            <Photo
              {...photosById[item.id]}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            photos={photos}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onNavigate={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
