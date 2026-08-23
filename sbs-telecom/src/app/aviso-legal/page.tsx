import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company } from "@/lib/content";

export const metadata: Metadata = { title: "Aviso legal" };

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <p>
        En cumplimiento del deber de información, se indican a continuación los datos identificativos de la
        empresa titular de este sitio web:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Denominación social: {company.legalName}</li>
        <li>
          Domicilio: {company.address.street}, {company.address.postalCode} {company.address.city}, {company.address.country}
        </li>
        <li>Teléfono: {company.phone}</li>
        <li>Email: {company.email}</li>
      </ul>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario y supone la aceptación de las
        condiciones aquí establecidas. Los contenidos de este sitio web tienen carácter meramente informativo.
      </p>
      <p>
        Para cualquier consulta relativa a este aviso legal, puede ponerse en contacto con nosotros a través del
        email {company.email} o del teléfono {company.phone}.
      </p>
    </LegalPage>
  );
}
