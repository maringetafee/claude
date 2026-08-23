import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company } from "@/lib/content";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <p>
        Este sitio web utiliza únicamente cookies técnicas, necesarias para su correcto funcionamiento. No se
        utilizan cookies de analítica ni de publicidad de terceros.
      </p>
      <p>
        Puede configurar su navegador para bloquear o eliminar las cookies almacenadas, aunque ello podría
        afectar al funcionamiento de algunas partes del sitio.
      </p>
      <p>
        Para cualquier consulta sobre esta política, escríbanos a {company.email}.
      </p>
    </LegalPage>
  );
}
