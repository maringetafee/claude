import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gracias por tu consulta",
  robots: { index: false, follow: true },
};

export default function GraciasPage() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper"
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/60">
        Solicitud enviada
      </p>
      <h1 className="mt-6 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        Gracias. Hemos recibido tu consulta.
      </h1>
      <p className="mt-6 max-w-md text-paper/70">
        Te contactaremos en breve. Si lo prefieres, también puedes llamarnos
        directamente al {siteConfig.phone.display}.
      </p>
      <Link
        href="/"
        className="mt-10 border border-paper/40 px-6 py-3 text-sm font-medium transition-colors hover:border-paper hover:bg-paper hover:text-ink"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
