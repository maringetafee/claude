import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de cookies",
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <main id="main" className="px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
      <Container className="max-w-3xl px-0">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Política de cookies</h1>
        <div className="mt-8">
          <Prose>
            <p>
              Esta web, en su versión actual, no utiliza cookies de
              analítica, publicidad ni de terceros. Solo se usa
              almacenamiento local del navegador (localStorage) para
              funciones internas como recordar tu progreso en la checklist
              del carnet — esta información no sale de tu dispositivo y no
              se comparte con {siteConfig.name} ni con terceros.
            </p>
            <p>
              Si en el futuro se incorporan herramientas de analítica o
              marketing que requieran cookies, esta página se actualizará y
              se solicitará el consentimiento correspondiente antes de
              activarlas.
            </p>
          </Prose>
        </div>
      </Container>
    </main>
  );
}
