"""
Genera output/sites/datos.html: una vista visual (foto, contacto, web,
valoracion y estado) de todos los leads/*.csv, en vez de tener que abrir
el CSV en bruto para verlos. Es la segunda pestaña del sitio, junto al panel
de propuestas que genera build_site.py.

Las tarjetas se agrupan por tipo de negocio (una sección por tipo, con las
ciudades como sub-etiqueta dentro de cada tarjeta) en vez de por tipo+ciudad,
para que el tipo sea el nivel principal de navegación.

Uso:
    python scripts/build_leads_data.py
"""
import csv
from pathlib import Path

from slugify import slugify

from site_common import (
    ESTADO_SYNC_SCRIPT,
    PLANTILLAS_MAESTRAS,
    SHARED_CSS,
    badge_html,
    cargar_estados,
    jump_nav,
    nav_tabs,
    orden_tipo,
    page_head_extra,
    stat_card,
    tipo_color,
    tipo_icon,
)

ROOT = Path(__file__).resolve().parent.parent
OUT_SITES = ROOT / "output" / "sites"


def cargar_leads():
    """Lee todos los leads/*.csv y devuelve una lista de dicts enriquecidos
    con slug, si tiene foto/demo generada, y el estado (si ya existe un
    borrador de email para ese lead)."""
    estados = cargar_estados()
    leads = []
    for csv_path in sorted(ROOT.glob("leads/*.csv")):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                slug = slugify(f"{row['business_name']}-{row['city']}")
                leads.append({
                    **row,
                    "slug": slug,
                    "tiene_foto": (OUT_SITES / "img" / f"{slug}.jpg").exists(),
                    "tiene_demo": (OUT_SITES / f"{slug}.html").exists(),
                    "estado": estados.get(slug),
                })
    return leads


def render_avatar(lead, color):
    if lead["tiene_foto"]:
        return f'<img class="avatar" src="img/{lead["slug"]}.jpg" alt="" loading="lazy" />'
    inicial = (lead["business_name"] or "?").strip()[:1].upper()
    return f'<div class="avatar avatar-placeholder" style="background:{color}1a;color:{color}">{inicial}</div>'


def render_contacto(lead):
    lineas = []
    phone = lead.get("phone", "")
    email = lead.get("email", "")
    if phone:
        lineas.append(f'<a href="tel:{phone}">{phone}</a>')
    if email:
        lineas.append(f'<a href="mailto:{email}">{email}</a>')
    if not lineas:
        lineas.append('<span class="muted">Sin contacto</span>')
    elif not email:
        lineas.append('<span class="muted">Solo teléfono/WhatsApp</span>')
    return "<br>".join(lineas)


def render_web(lead):
    tiene_web = lead.get("tiene_web") == "True"
    website = lead.get("website", "")
    if tiene_web and website:
        return f'<a class="web-link" href="{website}" target="_blank" rel="noopener">Ver web ↗</a>'
    return '<span class="badge badge-sinweb">Sin web</span>'


def render_rating(lead):
    rating = lead.get("rating", "")
    reviews = lead.get("review_count", "")
    if not rating:
        return ""
    return f'<span class="rating">★ {rating} <span class="reviews">({reviews})</span></span>'


def render_estado(lead):
    estado = lead["estado"]
    if not estado:
        return '<span class="muted">Sin generar</span>'
    return badge_html(lead["slug"], estado)


def render_card(lead, color):
    nombre = lead["business_name"]
    nombre_html = f'<a href="{lead["slug"]}.html">{nombre}</a>' if lead["tiene_demo"] else nombre
    direccion = lead.get("address", "")
    return f"""      <article class="card">
        {render_avatar(lead, color)}
        <div class="card-body">
          <div class="card-top">
            <div class="nombre">{nombre_html}</div>
            <span class="ciudad-tag">{lead.get('city', '')}</span>
          </div>
          <div class="direccion">{direccion}</div>
          <div class="card-meta">
            <span class="contacto">{render_contacto(lead)}</span>
            {render_rating(lead)}
          </div>
          <div class="card-foot">
            {render_web(lead)}
            {render_estado(lead)}
          </div>
        </div>
      </article>"""


def render_tipo_section(tipo, leads_tipo):
    color = tipo_color(tipo)
    ciudades = {}
    for lead in leads_tipo:
        ciudades[lead.get("city", "")] = ciudades.get(lead.get("city", ""), 0) + 1
    chips_html = "\n".join(
        f'<span>{ciudad} · {n}</span>' for ciudad, n in sorted(ciudades.items())
    )

    maestras = PLANTILLAS_MAESTRAS.get(tipo, [])
    maestra_html = "\n".join(
        f"""
        <a class="maestra" href="{href}">
          <span class="maestra-tag">Plantilla maestra</span>
          <span class="maestra-nombre">{nombre}</span>
          <span class="maestra-flecha">Ver demo &rarr;</span>
        </a>"""
        for nombre, href in maestras
    )

    leads_ordenados = sorted(leads_tipo, key=lambda l: (l.get("city", ""), l.get("business_name", "")))
    tarjetas = "\n".join(render_card(lead, color) for lead in leads_ordenados)

    con_web = sum(1 for l in leads_tipo if l.get("tiene_web") == "True")

    return f"""
    <section class="tipo" id="tipo-{tipo.lower()}" style="--tipo-color:{color}">
      <h2><span class="tipo-icon">{tipo_icon(tipo)}</span>{tipo} <span class="conteo">({len(leads_tipo)} · {len(leads_tipo) - con_web} sin web)</span></h2>
      <div class="ciudad-chips">
      {chips_html}
      </div>
      {maestra_html}
      <div class="card-grid">
{tarjetas}
      </div>
    </section>"""


def build():
    leads = cargar_leads()

    por_tipo = {}
    for lead in leads:
        tipo = lead.get("type_label", "Otros") or "Otros"
        por_tipo.setdefault(tipo, []).append(lead)

    tipos_ordenados = sorted(por_tipo.keys(), key=orden_tipo)
    secciones = "\n".join(render_tipo_section(tipo, por_tipo[tipo]) for tipo in tipos_ordenados)

    con_web = sum(1 for lead in leads if lead.get("tiene_web") == "True")
    sin_web = len(leads) - con_web
    conteos_nav = {tipo: len(por_tipo[tipo]) for tipo in tipos_ordenados}

    stats_html = "\n      ".join([
        stat_card(len(leads), "Leads en total"),
        stat_card(sin_web, "Sin web"),
        stat_card(con_web, "Con web"),
        stat_card(len(tipos_ordenados), "Tipos de negocio"),
    ])

    datos_html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Datos de leads — panel interno</title>
<meta name="robots" content="noindex, nofollow" />
{page_head_extra()}
<style>
{SHARED_CSS}
  .card-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
  }}
  .card {{
    display: flex;
    gap: .9rem;
    padding: 1rem;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 12px;
  }}
  .avatar {{
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
    display: block;
  }}
  .avatar-placeholder {{
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Fraunces", serif;
    font-weight: 500;
    font-size: 1.3rem;
  }}
  .card-body {{ flex: 1; min-width: 0; }}
  .card-top {{ display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }}
  .nombre {{ font-weight: 600; font-size: .95rem; line-height: 1.3; }}
  .nombre a {{ color: inherit; text-decoration: none; }}
  .nombre a:hover {{ text-decoration: underline; }}
  .ciudad-tag {{ font-size: .68rem; color: var(--ink-soft); white-space: nowrap; flex-shrink: 0; }}
  .direccion {{ color: var(--ink-soft); font-size: .78rem; margin-top: .15rem; }}
  .card-meta {{ display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-top: .55rem; font-size: .82rem; }}
  .card-meta a {{ color: #1a4fd6; text-decoration: none; }}
  .card-meta a:hover {{ text-decoration: underline; }}
  .rating {{ white-space: nowrap; color: #a3791a; font-size: .8rem; flex-shrink: 0; }}
  .reviews {{ color: var(--ink-soft); font-size: .74rem; }}
  .muted {{ color: #b0b0b6; }}
  .web-link {{ color: #157a3d; text-decoration: none; font-weight: 500; font-size: .82rem; white-space: nowrap; }}
  .web-link:hover {{ text-decoration: underline; }}
  .card-foot {{ display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-top: .65rem; }}
</style>
</head>
<body>
{nav_tabs('datos')}
<h1>Datos de leads</h1>
<p class="resumen">Todos los leads/*.csv, agrupados por tipo de negocio.</p>
<div class="stats-row">
      {stats_html}
</div>
{jump_nav(conteos_nav)}
{secciones}
{ESTADO_SYNC_SCRIPT}
</body>
</html>
"""
    OUT_SITES.mkdir(parents=True, exist_ok=True)
    (OUT_SITES / "datos.html").write_text(datos_html, encoding="utf-8")
    print(f"Generado: {OUT_SITES / 'datos.html'} ({len(leads)} leads, {len(tipos_ordenados)} tipos)")


if __name__ == "__main__":
    build()
