import Link from "next/link";
import { ProductGrid } from "@/components/shop/ProductCard";
import { MapEmbed } from "@/components/site/MapEmbed";
import { Preloader } from "@/components/site/Preloader";
import { BRAND } from "@/lib/brand";
import { getProducts } from "@/lib/catalog";
import { telHref } from "@/lib/content-shared";
import { SITE_URL } from "@/lib/env";
import { unsplashSrcSet } from "@/lib/product-utils";
import { getSiteContent } from "@/lib/site-data";

export const revalidate = 300;

// Palabras del manifiesto. *rosa* y ~salvia~ marcan el color final de la palabra.
const MANIFESTO =
  "Cada ramo es una pausa. Le damos *forma*, ~color~ y un motivo para regalar algo que de verdad se sienta especial.";

function ManifestoWords() {
  return MANIFESTO.split(" ").map((token, i) => {
    const color = token.includes("*") ? "#c2685a" : token.includes("~") ? "#6b7a5e" : undefined;
    const word = token.replace(/[*~]/g, "");
    return (
      <span key={i}>
        <span className="word" data-color={color}>
          {word}
        </span>{" "}
      </span>
    );
  });
}

const GALLERY_RATIOS = ["3/4", "1/1", "4/5"];

export default async function HomePage() {
  const [content, featured] = await Promise.all([getSiteContent(), getProducts(undefined, true, 4)]);
  const { hero, services, stats, reviews, gallery, contact } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: BRAND.name,
    url: SITE_URL,
    image: hero.image,
    logo: `${SITE_URL}/logo.svg`,
    telephone: contact.phone,
    email: contact.email || undefined,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressLocality: BRAND.city, addressRegion: "Madrid", addressCountry: "ES" },
    sameAs: contact.instagram ? [contact.instagram] : undefined,
  };

  return (
    <>
      <Preloader word={BRAND.name} meta={contact.area} />
      <main id="main">
        <section className="hero" id="inicio">
          <div className="hero__media">
            <img
              alt={hero.imageAlt}
              decoding="async"
              fetchPriority="high"
              sizes="100vw"
              src={hero.image}
              srcSet={unsplashSrcSet(hero.image, [800, 1200, 1600])}
            />
          </div>
          <div className="hero__petals" aria-hidden="true">
            <svg className="petal" style={{ left: "10%", top: "20%", width: 34 }} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="#d98a73" opacity=".55" /></svg>
            <svg className="petal" style={{ left: "78%", top: "14%", width: 26 }} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="#f3d9c8" opacity=".5" /></svg>
            <svg className="petal" style={{ left: "60%", top: "60%", width: 30 }} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="#8a9c78" opacity=".45" /></svg>
            <svg className="petal" style={{ left: "30%", top: "70%", width: 22 }} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="#d98a73" opacity=".4" /></svg>
            <svg className="petal" style={{ left: "88%", top: "50%", width: 20 }} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="#f3d9c8" opacity=".5" /></svg>
          </div>
          <div className="container hero__content">
            <div className="hero__kicker">
              <span /> {hero.kicker}
            </div>
            <h1 className="display hero__title">
              <span className="line"><span>{hero.line1}</span></span>
              <span className="line"><span>{hero.line2}</span></span>
              <span className="line"><span className="accent">{hero.line3}</span></span>
            </h1>
            <p className="hero__copy">{hero.copy}</p>
            <div className="hero__actions">
              <Link className="btn btn--solid magnetic" href="/tienda">
                Pedir ramo
              </Link>
              <Link className="btn btn--ghost magnetic" href="/#trabajos">
                Ver nuestro trabajo
              </Link>
            </div>
          </div>
        </section>

        <section className="section manifesto">
          <div className="container manifesto__grid">
            <aside className="manifesto__aside">
              <div className="eyebrow">Nuestra filosofía</div>
              <p>No hacemos ramos en serie. Elegimos flor de temporada y componemos cada pieza a mano, el mismo día que sale por la puerta.</p>
              <div className="manifesto__tag">
                <span>Flor fresca</span>
                <span>Temporada</span>
                <span>Hecho a mano</span>
              </div>
            </aside>
            <p className="manifesto__text">
              <ManifestoWords />
            </p>
          </div>
        </section>

        <section className="section services" id="servicios">
          <div className="container services__head">
            <div>
              <div className="eyebrow">Servicios</div>
              <h2 className="section-title">
                Diseñamos flor
                <br />
                para cada momento.
              </h2>
            </div>
            <p className="lead">Desde un ramo espontáneo hasta la decoración floral completa de tu boda. Cuéntanos la ocasión y nos encargamos del resto.</p>
          </div>
          <div className="services__viewport">
            <div className="services__track">
              {[0, 1].map((copy) =>
                services.map((s, i) => (
                  <article className="service-card" key={`${copy}-${i}`} aria-hidden={copy === 1 ? true : undefined}>
                    <div className="service-card__media">
                      <img
                        alt={copy === 1 ? "" : s.alt}
                        decoding="async"
                        loading="lazy"
                        sizes="(max-width:640px) 74vw, 400px"
                        src={s.image}
                        srcSet={unsplashSrcSet(s.image, [500, 800])}
                      />
                    </div>
                    <span className="service-card__number">{String(i + 1).padStart(2, "0")}</span>
                    <div className="service-card__content">
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                      <div className="service-card__meta">
                        <span>{s.metaLeft}</span>
                        <span>{s.metaRight}</span>
                      </div>
                    </div>
                  </article>
                )),
              )}
            </div>
          </div>
        </section>

        <section className="section craft" id="metodo">
          <div className="container craft__grid">
            <div className="craft__media" aria-label="El taller floral en proceso">
              <div className="craft__img craft__img-a reveal-img"><img alt="Pala de jardinería con tierra" decoding="async" loading="lazy" sizes="(max-width:980px) 60vw, 32vw" src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=78" /></div>
              <div className="craft__img craft__img-b reveal-img"><img alt="Suculenta en maceta blanca" decoding="async" loading="lazy" sizes="(max-width:980px) 44vw, 22vw" src="https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=700&q=78" /></div>
              <div className="craft__img craft__img-c reveal-img"><img alt="Tulipán rosa sobre fondo rosa" decoding="async" loading="lazy" sizes="(max-width:980px) 40vw, 20vw" src="https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=700&q=78" /></div>
              <div className="craft__img craft__img-d reveal-img"><img alt="Lirio rosa en jarrón de cristal" decoding="async" loading="lazy" sizes="(max-width:980px) 50vw, 25vw" src="https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&w=700&q=78" /></div>
            </div>
            <div className="craft__content">
              <div className="eyebrow">El taller</div>
              <h2 className="section-title">
                Flor de temporada.
                <br />
                Trabajo de taller.
              </h2>
              <p>No trabajamos con catálogo fijo — la flor cambia cada semana según lo que llega fresco del mercado, y eso se nota en cada ramo.</p>
              <ol className="craft__list">
                <li><strong>01</strong><span>Seleccionamos la flor de temporada cada mañana.</span></li>
                <li><strong>02</strong><span>Escuchamos qué ocasión estás celebrando.</span></li>
                <li><strong>03</strong><span>Componemos el ramo a mano en el taller.</span></li>
                <li><strong>04</strong><span>Entregamos el mismo día, fresco de verdad.</span></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section stats" aria-label="Datos de la floristería">
          <div className="container stats__grid">
            {stats.map((s, i) => (
              <div className="stat" key={i}>
                <strong data-count={s.value}>{s.value.toLocaleString("es-ES")}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="section shop" id="tienda" aria-labelledby="featured-title">
            <div className="container">
              <div className="featured__head">
                <div>
                  <div className="eyebrow">Tienda online</div>
                  <h2 className="section-title" id="featured-title">
                    Pide online.
                    <br />
                    <span className="accent">Nosotros la llevamos.</span>
                  </h2>
                </div>
                <p className="lead">Ramos, coronas y centros listos para regalar. Elige día y franja de entrega y paga de forma segura.</p>
              </div>
              <ProductGrid products={featured} />
              <div className="featured__more">
                <Link className="btn btn--ink btn--lg magnetic" href="/tienda">
                  Ver toda la tienda
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="section looks" id="trabajos">
          <div className="container">
            <div className="looks__head">
              <div>
                <div className="eyebrow">Trabajos del taller</div>
                <h2 className="section-title">
                  Color, textura
                  <br />
                  y flor real.
                </h2>
              </div>
              <p className="lead">Una selección de composiciones reales del taller: ramos, centros y detalles hechos a mano.</p>
            </div>
            <div className="looks__grid">
              {gallery.map((g, i) => (
                <figure className="look reveal-img magnetic" key={i} style={{ aspectRatio: GALLERY_RATIOS[i % 3] }}>
                  <img alt={g.alt} decoding="async" loading="lazy" src={g.image} />
                  <figcaption className="look__caption">
                    <strong>{g.title}</strong>
                    <span>{g.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section reviews" id="opiniones">
          <div className="container reviews__wrap">
            <div className="reviews__intro">
              <div style={{ fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(255,255,255,.6)" }}>
                <b style={{ color: "#4285f4" }}>G</b> Opiniones en Google
              </div>
              <div className="reviews__score">
                <strong>{reviews.score}</strong>
                <div>
                  <div className="reviews__stars">★★★★★</div>
                  <div className="reviews__meta">{reviews.count}</div>
                </div>
              </div>
              <p style={{ marginTop: 18, color: "rgba(255,255,255,.72)", maxWidth: "46ch" }}>{reviews.intro}</p>
            </div>
            <div className="reviews__grid">
              {reviews.items.map((r, i) => (
                <div className="review-card" key={i}>
                  <div className="review-card__stars">★★★★★</div>
                  <p>«{r.text}»</p>
                  <strong>— {r.author}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section visit" id="visitanos">
          <div className="container visit__grid">
            <div>
              <div className="eyebrow">Visítanos</div>
              <h2 className="section-title">
                Ven a ver
                <br />
                la flor de hoy.
              </h2>
              <div className="visit__details">
                <div className="visit__row"><span>Dirección</span><div>{contact.address}</div></div>
                <div className="visit__row"><span>Horario</span><div>{contact.hours}</div></div>
                <div className="visit__row"><span>Teléfono</span><div><a href={telHref(contact.phone)}>{contact.phone}</a></div></div>
                <div className="visit__row"><span>Barrio</span><div>{contact.area}</div></div>
              </div>
              <div style={{ marginTop: 30 }}>
                <a className="btn btn--solid magnetic" href={telHref(contact.phone)}>
                  Llamar a la floristería
                </a>
              </div>
            </div>
            <div className="visit__map">
              <MapEmbed address={contact.address} title={`Mapa de ${BRAND.name}`} />
            </div>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
