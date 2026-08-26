import { motion } from 'framer-motion'
import { photosById } from '../content/media'
import { Photo } from './Photo'

export function Ambiente() {
  return (
    <section id="ambiente" className="relative overflow-hidden bg-night py-20 sm:py-28">
      <div className="absolute inset-0 opacity-40">
        <Photo {...photosById.barra} className="h-full w-full object-cover" sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/85 to-night/60" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft"
        >
          Ambiente
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 font-display text-3xl font-medium text-on-night sm:text-4xl"
        >
          Música en directo los fines de semana, mesa a mesa
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-base leading-relaxed text-on-night-muted sm:text-lg"
        >
          Los clientes describen el local como limpio, acogedor y con un trato cercano de todo el equipo de
          sala. Un sitio pensado para volver con amigos o en familia, entre semana o para una cena de fin de
          semana con música en vivo.
        </motion.p>
      </div>
    </section>
  )
}
