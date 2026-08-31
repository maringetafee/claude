import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
        Error 404
      </span>
      <h1 className="mt-6 max-w-lg font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-tight text-ink text-balance">
        Esta página no ha encontrado su lugar.
      </h1>
      <p className="mt-5 max-w-sm text-[1rem] text-stone">
        Puede que el enlace esté roto o que la propiedad ya no esté
        disponible. Vuelve al catálogo para seguir explorando.
      </p>
      <div className="mt-10">
        <Button href="/propiedades">Ver propiedades</Button>
      </div>
    </div>
  );
}
