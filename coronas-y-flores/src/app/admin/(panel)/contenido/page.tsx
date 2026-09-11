import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { mergeContent } from "@/lib/content-shared";
import { ContentEditor } from "./ContentEditor";

export const metadata: Metadata = { title: "Contenido de la web" };

export default async function ContentPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("site_content").select("data").eq("id", 1).maybeSingle();
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Contenido de la web</h1>
          <p className="adm-sub">Textos y fotos de la portada, datos de contacto y pie de página.</p>
        </div>
        <a className="adm-btn" href="/" target="_blank" rel="noopener">
          Ver la portada ↗
        </a>
      </div>
      <ContentEditor initial={mergeContent(data?.data)} />
    </>
  );
}
