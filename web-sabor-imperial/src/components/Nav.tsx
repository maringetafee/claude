import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { restaurant } from '../content/restaurant'

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#carta', label: 'Carta' },
  { href: '#galeria', label: 'Galería' },
  { href: '#ambiente', label: 'Ambiente' },
  { href: '#resenas', label: 'Reseñas' },
  { href: '#horario', label: 'Horario y contacto' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#inicio')
  const [scrolled, setScrolled] = useState(false)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(`#${visible[0].target.id}`)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      firstLinkRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[60] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas transition-transform focus-visible:translate-y-0"
      >
        Saltar al contenido principal
      </a>

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-canvas/90 backdrop-blur-md shadow-[0_1px_0_var(--color-hairline)]' : 'bg-transparent'
        }`}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        >
          <a href="#inicio" className="font-display text-lg font-semibold tracking-tight text-ink">
            Sabor Imperial <span className="text-brick">RestoBar</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active === link.href ? 'text-brick' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={restaurant.phoneHref}
              className="rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              Llamar
            </a>
            <a
              href="#horario"
              className="rounded-full bg-brick px-4 py-2 text-sm font-semibold text-canvas transition-transform hover:bg-brick-active active:scale-[0.97]"
            >
              Reservar
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          >
            <span className="sr-only">Menú</span>
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-night/95 backdrop-blur-sm lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-24">
              <ul className="flex flex-1 flex-col gap-1">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-white/10 py-4 font-display text-2xl text-on-night"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="flex gap-3"
              >
                <a
                  href={restaurant.phoneHref}
                  className="flex-1 rounded-full border border-white/20 px-4 py-3 text-center font-semibold text-on-night"
                >
                  Llamar
                </a>
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-full bg-brick px-4 py-3 text-center font-semibold text-canvas"
                >
                  Cómo llegar
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
