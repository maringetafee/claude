"""
Genera output/sites/datos.html: una vista visual (foto, contacto, web,
valoracion y estado) de todos los leads/*.csv, en vez de tener que abrir
el CSV en bruto para verlos. Es la segunda pestaña del sitio, junto al panel
de propuestas que genera build_site.py.

Uso:
    python scripts/build_leads_data.py
"""
import csv
from pathlib import Path

from slugify import slugify

from site_common import ESTADO_SYNC_SCRIPT, SHARED_CSS, badge_html, cargar_estados, nav_tabs

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


def render_foto(lead):
    if lead["tiene_foto"]:
        return f'<img class="foto" src="img/{lead["slug"]}.jpg" alt="" loading="lazy" />'
    inicial = (lead["business_name"] or "?").strip()[:1].upper()
    return f'<div class="foto foto-placeholder">{inicial}</div>'


def render_negocio(lead):
    nombre = lead["business_name"]
    if lead["tiene_demo"]:
        nombre_html = f'<a href="{lead["slug"]}.html">{nombre}</a>'
    else:
        nombre_html = nombre
    direccion = lead.get("address", "")
    return f"""<div class="nombre">{nombre_html}</div>
        <div class="direccion">{direccion}</div>"""


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
        lineas.append('<span class="muted">Solo por teléfono/WhatsApp</span>')
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
        return '<span class="muted">—</span>'
    return f'★ {rating} <span class="reviews">({reviews})</span>'


def render_estado(lead):
    estado = lead["estado"]
    if not estado:
        return '<span class="muted">Sin generar</span>'
    return badge_html(lead["slug"], estado)


def render_grupo(clave, leads_grupo):
    tipo, city = clave
    filas = "\n".join(
        f"""      <tr>
        <td class="col-foto">{render_foto(lead)}</td>
        <td class="col-negocio">{render_negocio(lead)}</td>
        <td class="col-contacto">{render_contacto(lead)}</td>
        <td class="col-web">{render_web(lead)}</td>
        <td class="col-rating">{render_rating(lead)}</td>
        <td class="col-estado">{render_estado(lead)}</td>
      </tr>"""
        for lead in leads_grupo
    )
    return f"""
    <section class="grupo">
      <h2>{tipo} <span class="ciudad">· {city}</span> <span class="conteo">({len(leads_grupo)})</span></h2>
      <div class="tabla-wrap">
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Negocio</th>
            <th>Contacto</th>
            <th>Web</th>
            <th>Valoración</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
{filas}
        </tbody>
      </table>
      </div>
    </section>"""


def build():
    leads = cargar_leads()

    grupos = {}
    for lead in leads:
        clave = (lead.get("type_label", "Otros") or "Otros", lead.get("city", ""))
        grupos.setdefault(clave, []).append(lead)

    secciones = "\n".join(
        render_grupo(clave, grupos[clave]) for clave in sorted(grupos.keys())
    )

    con_web = sum(1 for lead in leads if lead.get("tiene_web") == "True")
    resumen = f"{len(leads)} leads en total — {len(leads) - con_web} sin web, {con_web} con web"

    datos_html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Datos de leads — panel interno</title>
<meta name="robots" content="noindex, nofollow" />
<style>
{SHARED_CSS}
  body {{ max-width: 1180px; }}
  section.grupo {{
    background: #fff;
    border: 1px solid #e5e5e8;
    border-radius: 14px;
    padding: 1.5rem 1.5rem 0.5rem;
    margin-bottom: 2rem;
  }}
  h2 {{ font-size: 1.1rem; margin: 0 0 1rem; font-weight: 600; }}
  h2 .ciudad {{ font-weight: 400; color: #6b6b70; }}
  h2 .conteo {{ font-weight: 400; color: #8a8a90; font-size: 0.9rem; }}
  .tabla-wrap {{ overflow-x: auto; margin: 0 -1.5rem; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 0.88rem; }}
  th {{
    text-align: left;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #8a8a90;
    padding: 0 1rem 0.6rem 1.5rem;
    border-bottom: 1px solid #e5e5e8;
  }}
  th:first-child, td:first-child {{ padding-left: 1.5rem; }}
  td {{
    padding: 0.7rem 1rem 0.7rem 1.5rem;
    border-bottom: 1px solid #f2f2f4;
    vertical-align: middle;
  }}
  tr:last-child td {{ border-bottom: none; }}
  .foto {{
    width: 42px;
    height: 42px;
    border-radius: 8px;
    object-fit: cover;
    display: block;
  }}
  .foto-placeholder {{
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ececec;
    color: #8a8a90;
    font-weight: 600;
  }}
  .col-negocio {{ min-width: 200px; }}
  .nombre {{ font-weight: 600; }}
  .nombre a {{ color: inherit; text-decoration: none; }}
  .nombre a:hover {{ text-decoration: underline; }}
  .direccion {{ color: #8a8a90; font-size: 0.8rem; margin-top: 0.15rem; }}
  .col-contacto a {{ color: #1a4fd6; text-decoration: none; }}
  .col-contacto a:hover {{ text-decoration: underline; }}
  .muted {{ color: #b0b0b6; }}
  .web-link {{ color: #157a3d; text-decoration: none; font-weight: 500; white-space: nowrap; }}
  .web-link:hover {{ text-decoration: underline; }}
  .reviews {{ color: #8a8a90; font-size: 0.8rem; }}
</style>
</head>
<body>
{nav_tabs('datos')}
<h1>Datos de leads</h1>
<p class="resumen">{resumen}</p>
{secciones}
{ESTADO_SYNC_SCRIPT}
</body>
</html>
"""
    OUT_SITES.mkdir(parents=True, exist_ok=True)
    (OUT_SITES / "datos.html").write_text(datos_html, encoding="utf-8")
    print(f"Generado: {OUT_SITES / 'datos.html'} ({len(leads)} leads, {len(grupos)} grupos)")


if __name__ == "__main__":
    build()
