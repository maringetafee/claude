import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import { legalBySlug } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalBySlug["politica-de-cookies"];

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description: doc.description,
  path: "/politica-de-cookies/",
});

export default function Page() {
  return <LegalDocument doc={doc} />;
}
