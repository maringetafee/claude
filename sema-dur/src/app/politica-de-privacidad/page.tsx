import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import { legalBySlug } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalBySlug["politica-de-privacidad"];

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description: doc.description,
  path: "/politica-de-privacidad/",
});

export default function Page() {
  return <LegalDocument doc={doc} />;
}
