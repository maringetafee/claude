import type { Metadata } from "next";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Política de cookies",
  robots: { index: false, follow: true },
};

export default function PoliticaCookiesPage() {
  return (
    <main id="main" className="px-6 pb-20 pt-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl">
          Política de cookies
        </h1>
        <Prose>
          <p>
            Este sitio web, propiedad de TOLDOS GETAFE, S.L., utiliza
            únicamente cookies técnicas estrictamente necesarias para su
            correcto funcionamiento. Actualmente no se utilizan cookies de
            estadística ni de marketing/seguimiento.
          </p>

          <h2>¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño archivo que se almacena en tu
            navegador al visitar una web, y que permite recordar
            información sobre tu visita.
          </p>

          <h2>Cookies utilizadas</h2>
          <p>
            El envío del formulario de contacto se procesa a través de un
            proveedor externo (Netlify) que puede emplear una cookie
            técnica para la prevención de spam durante el envío. No se
            utiliza ninguna cookie con fines publicitarios ni de
            seguimiento de la navegación.
          </p>

          <h2>Gestión de cookies</h2>
          <p>
            Puedes eliminar o bloquear las cookies desde la configuración
            de tu navegador. Ten en cuenta que bloquear las cookies
            técnicas puede afectar al correcto funcionamiento del
            formulario de contacto.
          </p>

          <h2>Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política de cookies, puedes
            escribirnos a comercial@toldosgetafe.es.
          </p>
        </Prose>
      </div>
    </main>
  );
}
