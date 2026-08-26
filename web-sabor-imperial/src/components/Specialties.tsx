import { motion } from 'framer-motion'
import { specialties } from '../content/restaurant'
import { photosById } from '../content/media'
import { Photo } from './Photo'

export function Specialties() {
  return (
    <section id="especialidades" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brick">Lo más pedido</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Especialidades de la casa</h2>
        </div>
        <a href="#carta" className="hidden shrink-0 text-sm font-semibold text-brick underline-offset-4 hover:underline sm:block">
          Ver carta completa →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {specialties.map((dish, i) => {
          const photo = photosById[dish.id]
          return (
            <motion.article
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-[1.25rem] bg-surface shadow-card"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <Photo
                  {...photo}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-ink">{dish.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{dish.description}</p>
              </div>
            </motion.article>
          )
        })}
      </div>

      <a href="#carta" className="mt-8 block text-center text-sm font-semibold text-brick underline-offset-4 hover:underline sm:hidden">
        Ver carta completa →
      </a>
    </section>
  )
}
