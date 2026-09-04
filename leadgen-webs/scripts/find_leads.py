"""
Busca negocios de un tipo en una ciudad usando Google Places API (New),
y vuelca a un CSV cuales tienen web y cuales no (para priorizar el envio
de propuestas a los que no tienen web, o a los que la tienen pero floja).

Uso:
    python scripts/find_leads.py --city "Getafe" --type restaurante --limit 40

Tipos soportados: bar, restaurante, peluqueria, dental, estetica, floristeria, fisioterapia, unas
"""
import argparse
import csv
import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv
from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PHOTO_URL_TMPL = "https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=1200&key={key}"

TYPE_MAP = {
    "bar": {"query_es": "bares", "included_type": "bar", "label": "Bar"},
    "restaurante": {"query_es": "restaurantes", "included_type": "restaurant", "label": "Restaurante"},
    "peluqueria": {"query_es": "peluquerias", "included_type": "hair_care", "label": "Peluqueria"},
    "dental": {"query_es": "clinicas dentales", "included_type": "dentist", "label": "Dental"},
    "estetica": {"query_es": "centros de estetica", "included_type": "beauty_salon", "label": "Estetica"},
    "floristeria": {"query_es": "floristerias", "included_type": "florist", "label": "Floristeria"},
    "fisioterapia": {"query_es": "clinicas de fisioterapia", "included_type": "physiotherapist", "label": "Fisioterapia"},
    "unas": {"query_es": "salones de unas", "included_type": "nail_salon", "label": "Unas"},
}

FIELD_MASK = ",".join([
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.internationalPhoneNumber",
    "places.websiteUri",
    "places.rating",
    "places.userRatingCount",
    "places.photos",
    "nextPageToken",
])


def fetch_page(query_text, included_type, page_token=None):
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }
    # Google exige que una peticion de paginacion repita exactamente los
    # mismos parametros que la peticion inicial, y solo anada pageToken.
    body = {"textQuery": query_text, "includedType": included_type, "languageCode": "es"}
    if page_token:
        body["pageToken"] = page_token
    resp = requests.post(SEARCH_URL, json=body, headers=headers, timeout=20)
    resp.raise_for_status()
    return resp.json()


def download_photo(photo_name, place_id, out_dir):
    out_dir.mkdir(parents=True, exist_ok=True)
    dest = out_dir / f"{place_id}.jpg"
    if dest.exists():
        return str(dest)
    url = PHOTO_URL_TMPL.format(photo_name=photo_name, key=API_KEY)
    resp = requests.get(url, timeout=20)
    if resp.status_code == 200:
        dest.write_bytes(resp.content)
        return str(dest)
    return ""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--city", required=True, help="Ciudad a buscar, ej: Getafe")
    parser.add_argument("--type", required=True, choices=TYPE_MAP.keys())
    parser.add_argument("--limit", type=int, default=40, help="Maximo de resultados (Google pagina de 20 en 20)")
    parser.add_argument("--no-photos", action="store_true", help="No descargar foto de portada de cada negocio")
    args = parser.parse_args()

    if not API_KEY:
        raise SystemExit(
            "Falta GOOGLE_PLACES_API_KEY. Copia .env.example a .env y pega tu clave "
            "(ver README.md para como conseguirla)."
        )

    cfg = TYPE_MAP[args.type]
    query_text = f"{cfg['query_es']} en {args.city}"

    results = []
    page_token = None
    while len(results) < args.limit:
        data = fetch_page(query_text, cfg["included_type"], page_token)
        places = data.get("places", [])
        results.extend(places)
        page_token = data.get("nextPageToken")
        if not page_token or not places:
            break
        time.sleep(2)  # Google exige un pequeno retraso antes de usar el siguiente pageToken

    results = results[: args.limit]

    leads_dir = ROOT / "leads"
    leads_dir.mkdir(exist_ok=True)
    photos_dir = leads_dir / "photos"
    csv_path = leads_dir / f"{slugify(args.city)}_{args.type}.csv"

    rows = []
    for place in results:
        place_id = place.get("id", "")
        name = place.get("displayName", {}).get("text", "").strip()
        website = place.get("websiteUri", "")
        photo_path = ""
        if not args.no_photos and place.get("photos"):
            photo_name = place["photos"][0].get("name", "")
            if photo_name:
                photo_path = download_photo(photo_name, place_id, photos_dir)

        rows.append({
            "place_id": place_id,
            "business_name": name,
            "type_label": cfg["label"],
            "city": args.city,
            "address": place.get("formattedAddress", ""),
            "phone": place.get("internationalPhoneNumber", ""),
            "website": website,
            "tiene_web": bool(website),
            "rating": place.get("rating", ""),
            "review_count": place.get("userRatingCount", ""),
            "photo_path": photo_path,
        })

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else [
            "place_id", "business_name", "type_label", "city", "address", "phone",
            "website", "tiene_web", "rating", "review_count", "photo_path",
        ])
        writer.writeheader()
        writer.writerows(rows)

    sin_web = sum(1 for r in rows if not r["tiene_web"])
    print(f"Guardado {csv_path} — {len(rows)} negocios ({sin_web} sin web, {len(rows) - sin_web} con web).")


if __name__ == "__main__":
    main()
