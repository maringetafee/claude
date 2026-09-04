"""
Genera las webs personalizadas de leads/getafe_peluqueria.csv, eligiendo
plantilla-mujer o plantilla-hombre segun el nombre del negocio (barberia,
afeitados, "de caballeros" -> hombre; el resto, por defecto -> mujer, ya
que la mayoria son salones unisex o de estilistas sin senal de genero).

Uso:
    python scripts/personalize_peluquerias.py
"""
import csv
import sys
from pathlib import Path

from personalize_static import RUBRO_LABEL, personalize_html
from slugify import slugify

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_SITES = ROOT / "output" / "sites"
LEADS_DIR = ROOT / "leads"

HOMBRE_KEYWORDS = ["barberia", "barbería", "barbero", "barber", "afeitado", "de caballeros", "caballeros zayd"]

# El nombre no siempre delata que es una barberia (ej. "Peluqueria Agadir").
# Estos se revisaron a mano mirando la foto de Google Maps del negocio:
# rotulo/poste de barberia, sillones y clientela claramente masculina.
HOMBRE_POR_FOTO = {
    ("Alcorcon", "Tito Flow Peluquería"),
    ("Alcorcon", "Peluquería Soria"),
    ("Alcorcon", "Wolf Barbiere"),
    ("Alcorcon", "JennLo estilistas"),
    ("Fuenlabrada", "peluqueria fuenlabrada"),
    ("Fuenlabrada", "Peluqueria Los Amigos"),
    ("Fuenlabrada", "Carlos Conde Peluqueros Fuenlabrada"),
    ("Fuenlabrada", "Carlos Conde Peluqueros Carrefour Fuenlabrada"),
    ("Fuenlabrada", "Peluquería Tánger"),
    ("Getafe", "KAPAS PELUQUEROS"),
    ("Getafe", "PELUQUERIA SABBAH"),
    ("Leganes", "Peluqueria Agadir"),
    ("Leganes", "Promise Hairstudio"),
    ("Leganes", "Peluquería Sebastián"),
    ("Leganes", "Peluqueria maroune"),
    ("Leganes", "Salon Arte’Look"),
    ("Leganes", "Peluquería Casablanca"),
    ("Leganes", "Peluquería Master'S"),
    ("Leganes", "La Chaise du Barbiers leganes"),
    ("Mostoles", "Peluquería Moha"),
    ("Mostoles", "peluqueria salman mostoles"),
    ("Mostoles", "Peluquería Abel"),
    ("Mostoles", "Peluquería amigos"),
    ("Mostoles", "Peluquería Aga"),
    ("Parla", "Albertito Cutz"),
    ("Parla", "Chucho's Peluquería"),
    ("Parla", "Peluquería Anas"),
    ("Parla", "Famiy 44 bar"),
}


def es_hombre(row):
    nombre = row["business_name"].lower()
    if any(kw in nombre for kw in HOMBRE_KEYWORDS):
        return True
    return (row["city"], row["business_name"]) in HOMBRE_POR_FOTO


def main():
    csv_paths = sorted(LEADS_DIR.glob("*_peluqueria.csv"))
    rows = []
    for csv_path in csv_paths:
        rows.extend(csv.DictReader(csv_path.open(encoding="utf-8")))
    OUT_SITES.mkdir(parents=True, exist_ok=True)
    out_img = OUT_SITES / "img"
    out_img.mkdir(exist_ok=True)

    conteo = {"peluqueria-mujer": 0, "peluqueria-hombre": 0}
    for row in rows:
        template_slug = "peluqueria-hombre" if es_hombre(row) else "peluqueria-mujer"
        slug = slugify(f"{row['business_name']}-{row['city']}")
        html = personalize_html(template_slug, row)
        (OUT_SITES / f"{slug}.html").write_text(html, encoding="utf-8")

        photo_path = row.get("photo_path", "")
        if photo_path and Path(photo_path).exists():
            import shutil
            shutil.copy(photo_path, out_img / f"{slug}.jpg")

        conteo[template_slug] += 1
        print(f"{template_slug}: {row['business_name']}")

    print(f"\nTotal: {conteo['peluqueria-mujer']} con plantilla mujer, {conteo['peluqueria-hombre']} con plantilla hombre.")


if __name__ == "__main__":
    main()
