import { motion } from 'framer-motion'
import { restaurant } from '../content/restaurant'

export function Intro() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-brick"
      >
        Bienvenidos
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl"
      >
        Cocina peruana con producto fresco, en un salón cercano y sin pretensiones
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
      >
        En {restaurant.address.line1}, {restaurant.address.city}, servimos ceviches, mariscos y platos de
        tradición criolla junto a parrilla de pollo a la brasa. Las reseñas destacan raciones generosas, un
        salón limpio y acogedor, y música en directo los fines de semana.
      </motion.p>
    </section>
  )
}
