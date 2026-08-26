import { motion } from 'framer-motion'
import { restaurant, reviews } from '../content/restaurant'

export function Reviews() {
  return (
    <section id="resenas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brick">Reseñas verificadas</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Lo que dicen en Google</h2>
        </div>
        <a
          href={restaurant.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          ★ {restaurant.rating.value} · {restaurant.rating.count} reseñas en Google →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {reviews.map((review, i) => (
          <motion.figure
            key={review.author + i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-surface p-6 shadow-card"
          >
            <blockquote className="font-display text-lg leading-snug text-ink">“{review.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-muted">
              {review.author} · reseña de {review.source}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
