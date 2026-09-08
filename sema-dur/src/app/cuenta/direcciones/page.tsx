import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import LocalAddressBook from "@/components/account/LocalAddressBook";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Direcciones",
  description: "Guarda direcciones de envío para tus pedidos.",
  path: "/cuenta/direcciones/",
  noindex: true,
});

export default function DireccionesPage() {
  return (
    <AccountShell title="Direcciones" active="/cuenta/direcciones">
      <LocalAddressBook />
    </AccountShell>
  );
}
