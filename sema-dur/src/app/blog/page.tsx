import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import { posts } from "@/data/posts";
import { formatDate } from "@/lib/format";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Blog · Herramientas de corte",
  description:
    "Guías prácticas sobre herramientas de corte: diamante PCD, reafilado, fabricación a medida y acabado en tablero.",
  path: "/blog/",
});

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog/" },
        ])}
      />
      <PageHero
        eyebrow="Blog"
        title="Guías sobre herramientas de corte"
        lead="Recomendaciones técnicas para elegir, mantener y aprovechar mejor la herramienta de corte."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Blog" }]}
      />
      <Section space="md">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white transition-[border-color,box-shadow] hover:border-[var(--color-line-strong)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <Picture
                      image={post.image}
                      alt=""
                      sizes="(max-width: 768px) 92vw, 380px"
                      aspectRatio="16 / 10"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      {formatDate(post.date)} · {post.readingMinutes} min
                    </span>
                    <h2 className="text-lg font-semibold leading-snug group-hover:text-[var(--color-brand)]">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-snug text-[var(--color-ink-soft)]">
                      {post.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--color-brand)]">
                      Leer
                      <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
