import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import { legalBySlug } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalBySlug["condiciones-de-compra"];

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description: doc.description,
  path: "/condiciones-de-compra/",
});

export default function Page() {
  return <LegalDocument doc={doc} />;
}
