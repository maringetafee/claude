const LINKS = [
  { label: "Precios", href: "#presupuesto" },
  { label: "Planes", href: "#" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="border-t border-marble/10 bg-charcoal/60 px-6 pt-20 pb-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg tracking-[0.15em] text-marble">
              MAKEMY<span className="text-iris">WEB</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
              Webs a medida para negocios que quieren verse tan bien como
              trabajan.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs tracking-widest text-marble/50 uppercase">
              Enlaces
            </p>
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-stone transition-colors hover:text-marble"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs tracking-widest text-marble/50 uppercase">
              Contacto
            </p>
            <ul className="space-y-3 text-sm text-stone">
              <li>
                <a
                  href="mailto:makemyweb@gmail.com"
                  className="transition-colors hover:text-marble"
                >
                  makemyweb@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+34689872320"
                  className="transition-colors hover:text-marble"
                >
                  689 87 23 20
                </a>
              </li>
              <li>
                <a
                  href="tel:+34644434860"
                  className="transition-colors hover:text-marble"
                >
                  644 43 48 60
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs tracking-widest text-marble/50 uppercase">
              Legal
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="/aviso-legal.html"
                  className="text-sm text-stone hover:text-marble"
                >
                  Aviso legal
                </a>
              </li>
              <li>
                <a
                  href="/privacidad.html"
                  className="text-sm text-stone hover:text-marble"
                >
                  Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-marble/10 pt-8 text-center text-xs text-stone/60">
          © 2026 MAKEMYWEB. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
