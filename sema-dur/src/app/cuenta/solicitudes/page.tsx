import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import RequestsList from "@/components/account/RequestsList";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mis solicitudes",
  description: "Historial de solicitudes de presupuesto enviadas desde este navegador.",
  path: "/cuenta/solicitudes/",
  noindex: true,
});

export default function SolicitudesPage() {
  return (
    <AccountShell title="Mis solicitudes" active="/cuenta/solicitudes">
      <RequestsList />
    </AccountShell>
  );
}
