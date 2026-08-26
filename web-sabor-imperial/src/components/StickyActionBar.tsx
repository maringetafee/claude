import { restaurant } from '../content/restaurant'

export function StickyActionBar() {
  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 backdrop-blur-md lg:hidden"
      aria-label="Acciones rápidas"
    >
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        <a
          href={restaurant.phoneHref}
          className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-ink active:scale-95"
        >
          <span aria-hidden className="text-lg">
            ☎
          </span>
          <span className="text-[11px] font-semibold">Llamar</span>
        </a>
        <a
          href={restaurant.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-ink active:scale-95"
        >
          <span aria-hidden className="text-lg">
            ⚲
          </span>
          <span className="text-[11px] font-semibold">Cómo llegar</span>
        </a>
        <a
          href="#carta"
          className="flex flex-col items-center gap-0.5 rounded-xl bg-brick px-2 py-2 text-canvas active:scale-95"
        >
          <span aria-hidden className="text-lg">
            🍽
          </span>
          <span className="text-[11px] font-semibold">Ver carta</span>
        </a>
      </div>
    </nav>
  )
}
