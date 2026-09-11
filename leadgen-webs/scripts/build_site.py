"""
Reconstruye output/sites/index.html como un indice organizado por tipo de
negocio y estado, en vez del listado plano que genera personalize.py.

Cada apartado por tipo de negocio muestra arriba un enlace a la "plantilla
maestra" (la demo generica que se personaliza para ese tipo) y debajo las
webs de muestra generadas para leads concretos, agrupadas por estado
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
    PLANTILLAS_MAESTRAS,
    SHARED_CSS,
    badge_html,
    checkbox_hecho,
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
        <a class="maestra" href="{href}">
          <span class="maestra-tag">Plantilla maestra</span>
          <span class="maestra-nombre">{nombre}</span>
          <span class="maestra-flecha">Ver demo &rarr;</span>
        </a>"""
        for nombre, href in maestras
    )
    if not maestras:
        maestra_html = '<p class="sin-leads">Todavía no hay plantilla para este tipo.</p>'

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
          <a href="{e['slug']}.html">{e['business_name']}</a>
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
    <section class="tipo" id="tipo-{tipo.lower()}" style="--tipo-color:{tipo_color(tipo)}">
      <h2><span class="tipo-icon">{tipo_icon(tipo)}</span>{tipo} <span class="conteo">({len(entradas_tipo)})</span></h2>
      {maestra_html}
      {lista_html}
    </section>"""


def build():
    entradas = cargar_entradas()

    por_tipo = {}
    for e in entradas:
        por_tipo.setdefault(e["tipo"], []).append(e)

    # Los tipos con plantilla maestra se muestran siempre, aunque todavia no
    # tengan leads — asi el apartado (y su enlace a la demo) esta visible
    # desde el primer momento, no solo cuando ya se han buscado leads de ese tipo.
    tipos_a_mostrar = set(por_tipo.keys()) | set(PLANTILLAS_MAESTRAS.keys())
    tipos_ordenados = sorted(tipos_a_mostrar, key=orden_tipo)
    secciones = "\n".join(render_tipo_section(tipo, por_tipo.get(tipo, [])) for tipo in tipos_ordenados)

    total = len(entradas)
    conteos_nav = {tipo: len(por_tipo.get(tipo, [])) for tipo in tipos_ordenados}

    stats_html = "\n      ".join([
        stat_card(total, "Leads en propuesta"),
        *(
            stat_card(sum(1 for e in entradas if e["estado"] == estado), label)
            for estado, label in ESTADO_LABELS.items()
            if any(e["estado"] == estado for e in entradas)
        ),
    ])

    index_html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Propuestas de webs — panel interno</title>
<meta name="robots" content="noindex, nofollow" />
{page_head_extra()}
<style>
{SHARED_CSS}
  ul.leads {{ list-style: none; margin: 0; padding: 0; }}
  li.lead {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--line-soft);
  }}
  li.lead:last-child {{ border-bottom: none; }}
  li.lead a {{ color: #1a4fd6; text-decoration: none; }}
  li.lead a:hover {{ text-decoration: underline; }}
  .lead-right {{ display: flex; align-items: center; gap: 0.75rem; }}
  .sin-leads {{ color: var(--ink-soft); font-size: 0.9rem; margin: 0.5rem 0 0; }}
</style>
</head>
<body>
{nav_tabs('panel')}
<h1>Propuestas de webs</h1>
<p class="resumen">Sigue el progreso de cada lead, por tipo de negocio.</p>
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
    (OUT_SITES / "index.html").write_text(index_html, encoding="utf-8")
    print(f"Indice regenerado: {OUT_SITES / 'index.html'} ({total} leads, {len(por_tipo)} tipos)")

    build_leads_data.build()


if __name__ == "__main__":
    build()
