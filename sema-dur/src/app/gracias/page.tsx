import type { Metadata } from "next";
import { Suspense } from "react";
import GraciasContent from "./GraciasContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solicitud enviada",
  description: "Hemos recibido tu solicitud de presupuesto.",
  path: "/gracias/",
  noindex: true,
});

export default function GraciasPage() {
  return (
    <Suspense fallback={null}>
      <GraciasContent />
    </Suspense>
  );
}
