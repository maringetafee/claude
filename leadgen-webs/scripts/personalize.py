"""
Genera una web de muestra por cada lead del CSV, usando la plantilla que
corresponda a su tipo de negocio.

Uso:
    python scripts/personalize.py leads/getafe_restaurante.csv
    python scripts/personalize.py leads/getafe_restaurante.csv --solo-sin-web
"""
import argparse
import csv
import re
import shutil
from datetime import date
from pathlib import Path
from urllib.parse import quote

from jinja2 import Environment, FileSystemLoader
from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_MAP = {
    "Bar": "bar.html",
    "Restaurante": "restaurante.html",
    "Peluqueria": "peluqueria.html",
}


def digits_only(phone):
    return "".join(c for c in phone if c.isdigit())


def build_context(row):
    slug = slugify(f"{row['business_name']}-{row['city']}")
    phone = row.get("phone", "")
    phone_digits = digits_only(phone)
    photo_path = row.get("photo_path", "")
    hero_image = bool(photo_path and Path(photo_path).exists())

    return {
        "business_name": row["business_name"],
        "city": row["city"],
        "type_label": row["type_label"],
        "address": row.get("address", ""),
        "phone": phone,
        "tel_link": f"tel:{phone_digits}" if phone_digits else "#",
        "whatsapp_link": f"https://wa.me/{phone_digits}" if phone_digits else "#",
        "maps_embed_src": f"https://www.google.com/maps?q={quote(row.get('address', row['business_name']))}&output=embed",
        "hero_image": hero_image,
        "slug": slug,
        "year": date.today().year,
    }, slug, photo_path if hero_image else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path")
    parser.add_argument("--solo-sin-web", action="store_true", help="Genera solo para leads sin web")
    args = parser.parse_args()

    csv_path = Path(args.csv_path)
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))

    env = Environment(loader=FileSystemLoader(ROOT / "templates"))

    out_sites = ROOT / "output" / "sites"
    out_img = out_sites / "img"
    out_sites.mkdir(parents=True, exist_ok=True)
    out_img.mkdir(parents=True, exist_ok=True)

    generated = 0
    for row in rows:
        tiene_web = row.get("tiene_web") in ("True", "1", True)
        if args.solo_sin_web and tiene_web:
            continue

        template_file = TEMPLATE_MAP.get(row["type_label"])
        if not template_file:
            print(f"Sin plantilla para tipo '{row['type_label']}', salto {row['business_name']}")
            continue

        context, slug, photo_path = build_context(row)
        template = env.get_template(template_file)
        html = template.render(**context)

        (out_sites / f"{slug}.html").write_text(html, encoding="utf-8")
        if photo_path:
            shutil.copy(photo_path, out_img / f"{slug}.jpg")

        generated += 1
        print(f"Generado: {slug}.html ({row['business_name']})")

    build_index(out_sites)

    print(f"\n{generated} webs de muestra generadas en {out_sites}")


def build_index(out_sites):
    """Regenera index.html listando todas las webs de muestra ya generadas
    (de esta tanda y de tandas anteriores), para que la raiz del sitio
    publicado en Netlify no de 404 y sirva de indice para revisarlas."""
    title_re = re.compile(r"<title>(.*?)</title>")
    entries = []
    for html_file in sorted(out_sites.glob("*.html")):
        if html_file.name == "index.html":
            continue
        text = html_file.read_text(encoding="utf-8")
        match = title_re.search(text)
        label = match.group(1) if match else html_file.stem
        entries.append((label, html_file.name))

    items = "\n".join(
        f'<li><a href="{name}">{label}</a></li>' for label, name in entries
    )
    index_html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Webs de muestra generadas</title>
<meta name="robots" content="noindex, nofollow" />
<style>
  body {{ font-family: sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1.5rem; }}
  li {{ margin-bottom: 0.5rem; }}
  a {{ color: #1a4fd6; }}
</style>
</head>
<body>
<h1>Webs de muestra generadas ({len(entries)})</h1>
<ul>
{items}
</ul>
</body>
</html>
"""
    (out_sites / "index.html").write_text(index_html, encoding="utf-8")


if __name__ == "__main__":
    main()
