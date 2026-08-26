import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { restaurant } from '../content/restaurant'
import { getOpenStatus } from '../lib/hours'

export function HoursContact() {
  const status = getOpenStatus()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  const share = async () => {
    const shareData = {
      title: restaurant.name,
      text: `${restaurant.name} — ${restaurant.cuisine} en ${restaurant.address.city}`,
      url: restaurant.googleMapsUrl,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        /* user cancelled — no action needed */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
    }
  }

  return (
    <section id="horario" className="bg-canvas-deep py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-surface p-6 shadow-card sm:p-8"
        >
          <h2 className="font-display text-2xl font-semibold text-ink">Horario</h2>
          <p className={`mt-1 text-sm font-medium ${status.isOpen ? 'text-emerald-600' : 'text-brick'}`}>
            {status.label}
          </p>
          <ul className="mt-5 divide-y divide-hairline-soft">
            {restaurant.hours.map((day) => (
              <li
                key={day.day}
                className={`flex items-center justify-between py-2.5 text-sm ${
                  day.index === status.todayIndex ? 'font-semibold text-ink' : 'text-ink-soft'
                }`}
              >
                <span className="flex items-center gap-2">
                  {day.day}
                  {day.index === status.todayIndex && (
                    <span className="rounded-full bg-brick-tint px-2 py-0.5 text-[11px] font-semibold text-brick">
                      Hoy
                    </span>
                  )}
                </span>
                <span>{'closed' in day ? 'Cerrado' : `${day.open} – ${day.close}`}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="rounded-2xl bg-surface p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink">Contacto y ubicación</h2>
            <address className="mt-3 not-italic leading-relaxed text-ink-soft">
              {restaurant.address.line1}
              <br />
              {restaurant.address.postalCode} {restaurant.address.city}, {restaurant.address.region}
            </address>
            <p className="mt-2 text-ink-soft">{restaurant.phone}</p>
            <a
              href={restaurant.theForkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-brick hover:underline"
            >
              Ver en TheFork →
            </a>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={restaurant.phoneHref}
                className="col-span-2 rounded-full bg-brick px-5 py-3 text-center text-sm font-semibold text-canvas transition-transform active:scale-[0.97] sm:col-span-1"
              >
                Llamar ahora
              </a>
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 rounded-full border border-hairline px-5 py-3 text-center text-sm font-semibold text-ink transition-colors hover:border-ink sm:col-span-1"
              >
                Cómo llegar
              </a>
              <button
                type="button"
                onClick={share}
                aria-live="polite"
                className="col-span-2 rounded-full border border-hairline px-5 py-3 text-center text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                {copied ? 'Enlace copiado ✓' : 'Compartir restaurante'}
              </button>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {restaurant.services.map((s) => (
                <li key={s} className="rounded-full bg-hairline-soft px-3 py-1 text-xs font-medium text-ink-soft">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
