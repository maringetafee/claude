"""
Genera una web personalizada por lead a partir de una plantilla estatica de
static-templates/<slug>/index.html, sustituyendo los placeholders entre
corchetes ([NOMBRE DEL NEGOCIO], [CIUDAD], [Direccion del negocio]...) por
los datos reales del lead (nombre, ciudad, direccion, telefono, rating).

Las referencias relativas "assets/..." se reescriben a rutas absolutas
(/plantillas/<slug>/assets/...) porque el HTML generado vive plano en
output/sites/<slug-del-lead>.html, no junto a la carpeta assets/ original.

Uso:
    python scripts/personalize_static.py leads/getafe_floristeria.csv floristeria
    python scripts/personalize_static.py leads/getafe_unas.csv unas
"""
import argparse
import csv
import shutil
from pathlib import Path
from urllib.parse import quote, quote_plus

from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
STATIC_TEMPLATES = ROOT / "static-templates"
OUT_SITES = ROOT / "output" / "sites"

RUBRO_LABEL = {
    "floristeria": "Floristería",
    "unas": "Centro de uñas",
    "peluqueria-mujer": "Peluquería",
    "peluqueria-hombre": "Barbería",
    "bar": "Bar",
}


def personalize_html(template_slug, row):
    template_path = STATIC_TEMPLATES / template_slug / "index.html"
    html = template_path.read_text(encoding="utf-8")

    business_name = row["business_name"].strip()
    city = row["city"].strip()
    address = row.get("address", "") or city
    phone = row.get("phone", "").strip()
    phone_digits = "".join(c for c in phone if c.isdigit())
    rating = (row.get("rating") or "5.0").strip()
    rating_comma = rating.replace(".", ",")
    reviews = row.get("review_count") or "50"
    maps_query = quote(address)

    replacements = [
        ("[NOMBRE DEL NEGOCIO]", business_name),
        ("[NOMBRE]", business_name),
        ("[Nombre]", business_name),
        ("[RUBRO]", RUBRO_LABEL[template_slug]),
        ("[CIUDAD]", city),
        ("[Ciudad]", city),
        ("[Barrio]", city),
        ("[Provincia]", "Madrid"),
        ("[Dirección del negocio]", address),
        ("[Direccion]", quote_plus(address)),
        ("[CP]", ""),
        ("[X,X]", rating_comma),
        ("[XXX]", str(reviews)),
        ("Madrid,+España", maps_query),
        ("tel:+34000000000", f"tel:+{phone_digits}" if phone_digits else "tel:"),
        ("000 00 00 00", phone or "Sin teléfono"),
        ('href="assets/', f'href="/plantillas/{template_slug}/assets/'),
        ('src="assets/', f'src="/plantillas/{template_slug}/assets/'),
        ('content="assets/', f'content="/plantillas/{template_slug}/assets/'),
    ]
    for old, new in replacements:
        html = html.replace(old, new)

    return html


def run(csv_path, template_slug, solo_sin_web=False):
    rows = list(csv.DictReader(Path(csv_path).open(encoding="utf-8")))
    OUT_SITES.mkdir(parents=True, exist_ok=True)
    out_img = OUT_SITES / "img"
    out_img.mkdir(exist_ok=True)

    count = 0
    for row in rows:
        if solo_sin_web and row.get("tiene_web") == "True":
            continue
        slug = slugify(f"{row['business_name']}-{row['city']}")
        html = personalize_html(template_slug, row)
        (OUT_SITES / f"{slug}.html").write_text(html, encoding="utf-8")

        photo_path = row.get("photo_path", "")
        if photo_path and Path(photo_path).exists():
            shutil.copy(photo_path, out_img / f"{slug}.jpg")

        count += 1

    print(f"{count} webs generadas con plantilla '{template_slug}' desde {csv_path}")
    return count


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path")
    parser.add_argument("template_slug", choices=list(RUBRO_LABEL.keys()))
    parser.add_argument("--solo-sin-web", action="store_true")
    args = parser.parse_args()
    run(args.csv_path, args.template_slug, args.solo_sin_web)
