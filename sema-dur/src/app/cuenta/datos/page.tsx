import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import LocalProfileForm from "@/components/account/LocalProfileForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mis datos",
  description: "Guarda tus datos de cliente para agilizar las solicitudes.",
  path: "/cuenta/datos/",
  noindex: true,
});

export default function DatosPage() {
  return (
    <AccountShell title="Mis datos" active="/cuenta/datos">
      <LocalProfileForm />
    </AccountShell>
  );
}
