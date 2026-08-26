import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { menu, restaurant } from '../content/restaurant'

export function Menu() {
  const [activeId, setActiveId] = useState(menu[0].id)
  const active = menu.find((c) => c.id === activeId) ?? menu[0]

  return (
    <section id="carta" className="bg-canvas-deep py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brick">La carta</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Por categorías</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Precios verificados directamente en la carta del local · {restaurant.priceRange} de media.
          </p>
        </div>

        <div role="tablist" aria-label="Categorías de la carta" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
          {menu.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeId === cat.id}
              aria-controls={`panel-${cat.id}`}
              id={`tab-${cat.id}`}
              onClick={() => setActiveId(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeId === cat.id ? 'bg-ink text-canvas' : 'bg-surface text-ink-soft hover:bg-hairline-soft'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            id={`panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-surface p-6 shadow-card sm:p-8"
          >
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
              <h3 className="font-display text-2xl font-semibold text-ink">{active.title}</h3>
              <span className="shrink-0 font-display text-lg text-brick">{active.priceRange}</span>
            </div>

            {active.items && active.items.length > 0 ? (
              <ul className="mt-4 divide-y divide-hairline-soft">
                {active.items.map((item) => (
                  <li key={item.name} className="py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium text-ink">{item.name}</span>
                      {item.price && <span className="shrink-0 text-ink-soft">{item.price}</span>}
                    </div>
                    {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Categoría disponible en la carta física del local; consulta con el equipo de sala para el
                detalle completo de platos.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
