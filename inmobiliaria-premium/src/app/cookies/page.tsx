import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <p>
        Este sitio web utiliza cookies técnicas propias, estrictamente
        necesarias para su correcto funcionamiento, y no emplea cookies de
        analítica o publicidad de terceros.
      </p>
      <p>
        Puedes configurar tu navegador para bloquear o eliminar las cookies
        instaladas en tu equipo, aunque esto podría afectar a algunas
        funcionalidades del sitio.
      </p>
    </LegalPage>
  );
}
