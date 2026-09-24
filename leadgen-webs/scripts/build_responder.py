"""
Genera la pestaña "Responder" del panel:

- output/sites/responder.html: la página del agente de ventas (pegar la
  conversación con un negocio → respuesta lista para enviar, estrategia,
  diagnóstico, objeciones y pipeline). La maqueta vive en
  scripts/responder_template.html; aquí solo se le inyectan el CSS y la
  navegación compartidos.
- output/sites/responder-leads.json: la ficha de cada lead (leads/*.csv +
  datos de los borradores) para que el agente tenga el contexto del negocio.

Las dos rutas van detrás de la Basic Auth del panel (netlify.toml).
La lógica del agente está en netlify/functions/responder.mjs y los precios
y reglas de venta en netlify/functions/lib/makemyweb.mjs.

Uso:
    python scripts/build_responder.py
"""
import csv
import json
from pathlib import Path

from slugify import slugify

from site_common import SHARED_CSS, cargar_estados, nav_tabs, page_head_extra

ROOT = Path(__file__).resolve().parent.parent
OUT_SITES = ROOT / "output" / "sites"
TEMPLATE = Path(__file__).resolve().parent / "responder_template.html"

WEB_ESTADO_LABELS = {
    "propia": "web propia",
    "builder": "web de plantilla (Wix/Jimdo…)",
    "franquicia": "web de franquicia",
    "social": "solo redes sociales",
    "agregador": "solo directorios",
    "ninguna": "sin web",
}


def cargar_borradores():
    """{slug: fila del borrador} para sacar instagram y la demo publicada."""
    borradores = {}
    for csv_path in sorted(ROOT.glob("output/*_borradores.csv")):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if row.get("slug"):
                    borradores[row["slug"]] = row
    return borradores


def cargar_fichas():
    estados = cargar_estados()
    borradores = cargar_borradores()
    fichas = {}
    for csv_path in sorted(ROOT.glob("leads/*.csv")):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                slug = slugify(f"{row['business_name']}-{row['city']}")
                b = borradores.get(slug, {})
                web_estado = row.get("web_estado", "")
                ficha = {
                    "slug": slug,
                    "nombre": row.get("business_name", ""),
                    "tipo": row.get("type_label", ""),
                    "ciudad": row.get("city", ""),
                    "direccion": row.get("address", ""),
                    "telefono": row.get("phone", ""),
                    "email": row.get("email", ""),
                    "instagram": b.get("instagram", ""),
                    "web": row.get("website", ""),
                    "web_estado": WEB_ESTADO_LABELS.get(web_estado, web_estado),
                    "web_obsoleta": row.get("web_obsoleta", ""),
                    "web_motivos": row.get("web_motivos", ""),
                    "valoracion_google": row.get("rating", ""),
                    "num_resenas": row.get("review_count", ""),
                    "demo": b.get("preview_link", "") if (OUT_SITES / f"{slug}.html").exists() else "",
                    "estado_captacion": estados.get(slug, ""),
                }
                fichas[slug] = {k: v for k, v in ficha.items() if v}
    return sorted(fichas.values(), key=lambda f: f["nombre"].lower())


def build():
    fichas = cargar_fichas()
    OUT_SITES.mkdir(parents=True, exist_ok=True)
    (OUT_SITES / "responder-leads.json").write_text(
        json.dumps(fichas, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    html = (
        TEMPLATE.read_text(encoding="utf-8")
        .replace("__HEAD_EXTRA__", page_head_extra())
        .replace("__SHARED_CSS__", SHARED_CSS)
        .replace("__NAV__", nav_tabs("responder"))
    )
    (OUT_SITES / "responder.html").write_text(html, encoding="utf-8")
    print(f"Responder regenerado: {OUT_SITES / 'responder.html'} ({len(fichas)} fichas de leads)")


if __name__ == "__main__":
    build()
