import Link from "next/link";

const DEMOS = [
  {
    href: "/lumina",
    name: "LÚMINA",
    type: "Restaurante · luxury-editorial",
    description: "Serif editorial, hero asimétrico, carta con precios y motor de reservas con mapa de mesas.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=70",
  },
  {
    href: "/lolita",
    name: "Lolita",
    type: "Cocktail bar · nightlife",
    description: "Fondo oscuro, tipografía condensada de impacto, hero a pantalla completa, reserva de zona.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1000&q=70",
  },
  {
    href: "/casa-manolo",
    name: "Casa Manolo",
    type: "Bar de barrio · tavern-warm",
    description: "Tonos cálidos y serif tradicional, tapas y cañas, reserva simple sin mapa de mesas.",
    image: "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=1000&q=70",
  },
  {
    href: "/studio-x",
    name: "Studio X",
    type: "Peluquería · fashion-minimal",
    description: "Blanco y negro, hero partido, servicios con precio y duración, equipo, reserva de cita.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=70",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-6">Universal Local Business Website System</p>
        <h1 className="text-4xl md:text-6xl font-medium leading-[1.05] max-w-3xl mb-6">
          Una arquitectura. Cuatro experiencias completamente distintas.
        </h1>
        <p className="text-white/60 max-w-xl mb-16 leading-relaxed">
          Mismos componentes, mismo sistema de configuración — cada negocio cambia tipografía, layout,
          secciones, CTAs y motion. Nada de plantilla con otro color.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEMOS.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group block overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={demo.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-2">{demo.type}</p>
                <h2 className="text-xl font-medium mb-2">{demo.name}</h2>
                <p className="text-sm text-white/50 leading-relaxed">{demo.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
