import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappHref, whatsappMessages } from "@/lib/site-config";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Gracias",
  robots: { index: false, follow: true },
};

export default function GraciasPage() {
  return (
    <main id="main" className="flex min-h-[70vh] items-center py-28">
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-signal">
          Solicitud enviada
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          ¡Gracias! Ya tenemos tu solicitud.
        </h1>
        <p className="mt-4 text-ink-soft">
          Te contactaremos lo antes posible. Si tienes prisa, también puedes
          escribirnos directamente.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappHref(whatsappMessages.general)}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm bg-whatsapp px-6 py-3 text-sm font-semibold text-white"
          >
            Hablar por WhatsApp
          </a>
          <a href={siteConfig.phone.href} className="rounded-sm border border-ink/15 px-6 py-3 text-sm font-medium">
            Llamar: {siteConfig.phone.display}
          </a>
        </div>
        <Link href="/" className="mt-8 inline-block text-sm text-stone underline underline-offset-4">
          Volver al inicio
        </Link>
      </Container>
    </main>
  );
}
