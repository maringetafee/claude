import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Picture from "@/components/ui/Picture";
import Prose from "@/components/ui/Prose";
import { ButtonLink } from "@/components/ui/Button";
import { posts, postsBySlug } from "@/data/posts";
import { formatDate } from "@/lib/format";
import { pageMetadata, breadcrumbLd, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import JsonLd from "@/components/ui/JsonLd";
import { largestSrc } from "@/components/ui/Picture";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postsBySlug[slug];
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    image: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postsBySlug[slug];
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            image: new URL(largestSrc(post.image), SITE_URL).toString(),
            author: { "@type": "Organization", name: siteConfig.legalName },
            publisher: { "@type": "Organization", name: siteConfig.legalName },
          },
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Blog", path: "/blog/" },
            { name: post.title, path: `/blog/${post.slug}/` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`${formatDate(post.date)} · ${post.readingMinutes} min de lectura`}
        title={post.title}
        breadcrumbs={[
          { name: "Inicio", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title },
        ]}
      />

      <Section space="md">
        <Container className="max-w-3xl">
          <div className="mb-8 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <Picture
              image={post.image}
              alt=""
              sizes="(max-width: 768px) 92vw, 768px"
              priority
              aspectRatio="16 / 9"
            />
          </div>

          <Prose>
            {post.body.map((block, i) => {
              if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
              if (block.type === "ul")
                return (
                  <ul key={i}>
                    {block.items?.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                );
              return <p key={i}>{block.text}</p>;
            })}
          </Prose>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6">
            <h2 className="text-lg font-semibold">¿Tienes un caso concreto?</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Revisamos contigo el material, la máquina y el volumen para
              proponerte la herramienta adecuada.
            </p>
            <ButtonLink href="/contacto">Consultar con el equipo técnico</ButtonLink>
          </div>
        </Container>
      </Section>

      {more.length ? (
        <Section space="md" tone="soft">
          <Container>
            <h2 className="mb-6 text-xl font-bold">Más artículos</h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-4 transition-colors hover:border-[var(--color-line-strong)]"
                  >
                    <span className="h-16 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                      <Picture image={p.image} alt="" sizes="80px" aspectRatio="4 / 3" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-sm font-semibold leading-snug">
                        {p.title}
                      </span>
                      <span className="text-xs text-[var(--color-ink-muted)]">
                        {formatDate(p.date)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
