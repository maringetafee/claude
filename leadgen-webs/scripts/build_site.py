"""
Reconstruye output/sites/index.html como un indice organizado por tipo de
negocio y estado, en vez del listado plano que genera personalize.py.

Cada apartado por tipo de negocio muestra arriba un enlace a la "plantilla
maestra" (la demo generica de local-business-system para ese tipo) y debajo
las webs de muestra generadas para leads concretos, agrupadas por estado
(pendiente/enviado/respondido/cliente/rechazado...).

Lee el estado y el tipo desde output/*_borradores.csv (generado por
generate_email_drafts.py) — ahi es donde se marca a mano el progreso de
cada lead.

Uso:
    python scripts/build_site.py
"""
import csv
from pathlib import Path

import build_leads_data
from site_common import (
    ESTADO_LABELS,
    ESTADO_ORDEN,
    ESTADO_SYNC_SCRIPT,
    PANEL_SLUG,
    ROOT_PLACEHOLDER_HTML,
    SHARED_CSS,
    badge_html,
    checkbox_hecho,
    nav_tabs,
)

ROOT = Path(__file__).resolve().parent.parent
OUT_SITES = ROOT / "output" / "sites"
PANEL_DIR = OUT_SITES / PANEL_SLUG

# Tipo de negocio (tal y como aparece en las CSV de leads) -> plantillas
# maestras publicadas en output/sites/plantillas/ (export estatico de
# local-business-system). Un tipo puede tener mas de una plantilla (p.ej.
# Restaurante tiene una editorial y otra mas urbana/casual); se muestran
# todas. Si un tipo no tiene ninguna todavia, simplemente no se muestra nada.
PLANTILLAS_MAESTRAS = {
    "Bar": [("Casa Manolo — bar de barrio, tema tavern-warm", "plantillas/casa-manolo.html")],
    "Cocktail bar": [("Lolita — coctelería, tema nightlife", "plantillas/lolita.html")],
    "Restaurante": [
        ("Web Plantilla Burgers — hamburguesería", "plantillas/burgers/index.html"),
        ("LÚMINA — restaurante, tema luxury-editorial", "plantillas/lumina.html"),
    ],
    "Peluqueria": [("Studio X — peluquería, tema fashion-minimal", "plantillas/studio-x.html")],
}


def cargar_entradas():
    """Lee todos los output/*_borradores.csv y devuelve una lista de leads
    con tipo/slug/estado, evitando duplicados si un lead aparece en mas de
    un CSV (se queda con la ultima aparicion)."""
    entradas = {}
    for csv_path in sorted(ROOT.glob("output/*_borradores.csv")):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                slug = row.get("slug")
                if not slug:
                    continue
                html_file = OUT_SITES / f"{slug}.html"
                if not html_file.exists():
                    continue
                entradas[slug] = {
                    "business_name": row.get("business_name", slug),
                    "tipo": row.get("tipo", "Otros") or "Otros",
                    "slug": slug,
                    "estado": row.get("estado", "pendiente") or "pendiente",
                }
    return list(entradas.values())


def render_tipo_section(tipo, entradas_tipo):
    maestras = PLANTILLAS_MAESTRAS.get(tipo, [])
    maestra_html = "\n".join(
        f"""
        <a class="maestra" href="../{href}">
          <span class="maestra-tag">Plantilla maestra</span>
          <span class="maestra-nombre">{nombre}</span>
          <span class="maestra-flecha">Ver demo &rarr;</span>
        </a>"""
        for nombre, href in maestras
    )

    entradas_ordenadas = sorted(
        entradas_tipo,
        key=lambda e: (
            ESTADO_ORDEN.index(e["estado"]) if e["estado"] in ESTADO_ORDEN else len(ESTADO_ORDEN),
            e["business_name"],
        ),
    )

    if entradas_ordenadas:
        filas = "\n".join(
            f"""        <li class="lead">
          <a href="../{e['slug']}.html">{e['business_name']}</a>
          <span class="lead-right">
            {checkbox_hecho(e['slug'], e['estado'])}
            {badge_html(e['slug'], e['estado'])}
          </span>
        </li>"""
            for e in entradas_ordenadas
        )
        lista_html = f"""<ul class="leads">
{filas}
      </ul>"""
    else:
        lista_html = '<p class="sin-leads">Todavía no hay leads generados para este tipo.</p>'

    return f"""
    <section class="tipo">
      <h2>{tipo} <span class="conteo">({len(entradas_tipo)})</span></h2>
      {maestra_html}
      {lista_html}
    </section>"""


def build():
    if not PANEL_SLUG:
        raise SystemExit(
            "Falta PANEL_SLUG en .env — define una ruta no adivinable (ej. "
            "PANEL_SLUG=panel-xxxxxxxx) para publicar el panel interno fuera "
            "de la raiz del sitio. No uses un valor predecible como 'panel' o 'admin'."
        )

    entradas = cargar_entradas()

    por_tipo = {}
    for e in entradas:
        por_tipo.setdefault(e["tipo"], []).append(e)

    # Los tipos con plantilla maestra se muestran siempre, aunque todavia no
    # tengan leads — asi el apartado (y su enlace a la demo) esta visible
    # desde el primer momento, no solo cuando ya se han buscado leads de ese tipo.
    tipos_a_mostrar = set(por_tipo.keys()) | set(PLANTILLAS_MAESTRAS.keys())
    tipos_ordenados = sorted(tipos_a_mostrar, key=lambda t: (t not in PLANTILLAS_MAESTRAS, t))
    secciones = "\n".join(render_tipo_section(tipo, por_tipo.get(tipo, [])) for tipo in tipos_ordenados)

    total = len(entradas)
    resumen = ", ".join(
        f"{sum(1 for e in entradas if e['estado'] == estado)} {label.lower()}"
        for estado, label in ESTADO_LABELS.items()
        if any(e["estado"] == estado for e in entradas)
    )

    index_html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Propuestas de webs — panel interno</title>
<meta name="robots" content="noindex, nofollow" />
<style>
{SHARED_CSS}
  body {{ max-width: 880px; }}
  .resumen {{ margin-bottom: 3rem; }}
  h2 {{ font-size: 1.25rem; margin: 0 0 1rem; display: flex; align-items: baseline; gap: 0.5rem; }}
  .conteo {{ font-weight: 400; color: #8a8a90; font-size: 0.9rem; }}
  section.tipo {{
    background: #fff;
    border: 1px solid #e5e5e8;
    border-radius: 14px;
    padding: 1.75rem 1.75rem 1.25rem;
    margin-bottom: 2rem;
  }}
  a.maestra {{
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    text-decoration: none;
    color: inherit;
    background: #17171a;
    color: #fff;
    border-radius: 10px;
    padding: 0.9rem 1.1rem;
    margin-bottom: 1.25rem;
  }}
  a.maestra:hover {{ background: #2b2b30; }}
  .maestra-tag {{
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: rgba(255,255,255,0.15);
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
  }}
  .maestra-nombre {{ font-weight: 500; flex: 1; }}
  .maestra-flecha {{ font-size: 0.85rem; opacity: 0.8; white-space: nowrap; }}
  ul.leads {{ list-style: none; margin: 0; padding: 0; }}
  li.lead {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid #efeff1;
  }}
  li.lead:last-child {{ border-bottom: none; }}
  li.lead a {{ color: #1a4fd6; text-decoration: none; }}
  li.lead a:hover {{ text-decoration: underline; }}
  .lead-right {{ display: flex; align-items: center; gap: 0.75rem; }}
  .sin-leads {{ color: #8a8a90; font-size: 0.9rem; margin: 0.5rem 0 0; }}
</style>
</head>
<body>
{nav_tabs('panel')}
<h1>Propuestas de webs</h1>
<p class="resumen">{total} leads en total{" — " + resumen if resumen else ""}</p>
{secciones}
{ESTADO_SYNC_SCRIPT}
</body>
</html>
"""
    PANEL_DIR.mkdir(parents=True, exist_ok=True)
    (PANEL_DIR / "index.html").write_text(index_html, encoding="utf-8")
    print(f"Indice regenerado: {PANEL_DIR / 'index.html'} ({total} leads, {len(por_tipo)} tipos)")

    OUT_SITES.mkdir(parents=True, exist_ok=True)
    (OUT_SITES / "index.html").write_text(ROOT_PLACEHOLDER_HTML, encoding="utf-8")
    print(f"Pagina neutra escrita en la raiz: {OUT_SITES / 'index.html'}")

    build_leads_data.build()


if __name__ == "__main__":
    build()
