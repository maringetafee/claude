import { restaurant } from '../content/restaurant'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-hairline bg-canvas pb-24 pt-14 lg:pb-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              Sabor Imperial <span className="text-brick">RestoBar</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {restaurant.cuisine} en {restaurant.address.city}, Madrid.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Contacto</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href={restaurant.phoneHref} className="hover:text-ink">
                  {restaurant.phone}
                </a>
              </li>
              <li>{restaurant.address.line1}</li>
              <li>
                {restaurant.address.postalCode} {restaurant.address.city}
              </li>
              <li>
                <a href={restaurant.googleMapsUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
                  Ver en Google Maps →
                </a>
              </li>
              <li>
                <a href={restaurant.theForkUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
                  Ver en TheFork →
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Navegación</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href="#carta" className="hover:text-ink">
                  Carta
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-ink">
                  Galería
                </a>
              </li>
              <li>
                <a href="#horario" className="hover:text-ink">
                  Horario y contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-hairline-soft pt-6 text-xs text-muted-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Sabor Imperial RestoBar. Todos los derechos reservados.</p>
          <p>Datos de contacto y horario verificados en Google Maps.</p>
        </div>
      </div>
    </footer>
  )
}
