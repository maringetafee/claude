import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company } from "@/lib/content";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        {company.legalName} es el responsable del tratamiento de los datos personales que nos facilite a través
        del formulario de contacto de este sitio web.
      </p>
      <p>
        Los datos aportados se utilizan exclusivamente para responder a su solicitud de información o
        presupuesto, y —solo si así lo autoriza expresamente— para remitirle comunicaciones comerciales sobre
        nuestros servicios.
      </p>
      <p>
        No cedemos sus datos a terceros salvo obligación legal. Puede ejercer sus derechos de acceso,
        rectificación, supresión, oposición, limitación y portabilidad escribiendo a {company.email} o por
        correo postal a {company.address.street}, {company.address.postalCode} {company.address.city}.
      </p>
      <p>
        Para cualquier duda sobre el tratamiento de sus datos, contacte con nosotros en {company.email} o en el
        teléfono {company.phone}.
      </p>
    </LegalPage>
  );
}
