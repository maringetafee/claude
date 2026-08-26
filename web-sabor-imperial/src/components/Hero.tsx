import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { heroSlides } from '../content/media'
import { restaurant } from '../content/restaurant'
import { getOpenStatus } from '../lib/hours'
import { Photo } from './Photo'

const AUTOPLAY_MS = 5500

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const status = getOpenStatus()

  const go = useCallback((next: number) => {
    setDirection(next > index || (index === heroSlides.length - 1 && next === 0) ? 1 : -1)
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length)
  }, [index])

  useEffect(() => {
    if (paused || reduceMotion) return
    const id = window.setInterval(() => go(index + 1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [index, paused, reduceMotion, go])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1))
    touchStartX.current = null
  }

  return (
    <section
      id="inicio"
      aria-roledescription="carrusel"
      aria-label="Fotografías destacadas de Sabor Imperial RestoBar"
      className="relative isolate flex min-h-[100dvh] items-end overflow-hidden bg-night"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.0 }}
            transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            aria-live="off"
          >
            <Photo
              {...heroSlides[index]}
              priority={index === 0}
              className="h-full w-full object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-night/10" aria-hidden />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-40 sm:px-6 sm:pb-32 md:pb-40">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-night backdrop-blur-sm">
          {restaurant.cuisine} · Getafe
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-on-night sm:text-5xl md:text-6xl">
          {restaurant.tagline}
        </h1>
        <p className="mt-5 max-w-md text-base text-on-night-muted sm:text-lg">
          ★ {restaurant.rating.value} de media en {restaurant.rating.count} reseñas de Google · {restaurant.priceRange}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={restaurant.phoneHref}
            className="group inline-flex items-center gap-2 rounded-full bg-brick px-6 py-3.5 text-sm font-semibold text-canvas transition-transform active:scale-[0.97]"
          >
            Llamar para reservar
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="#carta"
            className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-on-night backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Ver la carta
          </a>
          <span className="ml-1 inline-flex items-center gap-2 text-sm text-on-night-muted">
            <span
              className={`h-2 w-2 rounded-full ${status.isOpen ? 'bg-emerald-400' : 'bg-white/40'}`}
              aria-hidden
            />
            {status.label}
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex gap-2" role="tablist" aria-label="Seleccionar fotografía">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Foto ${i + 1} de ${heroSlides.length}`}
              onClick={() => go(i)}
              className="group h-8 w-8 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-on-night' : 'w-3 bg-on-night/40 group-hover:bg-on-night/70'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => go(index - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-on-night backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => go(index + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-on-night backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            →
          </button>
          <button
            type="button"
            aria-pressed={paused}
            aria-label={paused ? 'Reanudar reproducción automática' : 'Pausar reproducción automática'}
            onClick={() => setPaused((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-on-night backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {paused ? '▶' : '❚❚'}
          </button>
        </div>
      </div>
    </section>
  )
}
