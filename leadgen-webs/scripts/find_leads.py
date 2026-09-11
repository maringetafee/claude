"""
Busca negocios de un tipo en una ciudad usando Google Places API (New),
y vuelca a un CSV cuales tienen web y cuales no (para priorizar el envio
de propuestas a los que no tienen web, o a los que la tienen pero floja).

Uso:
    python scripts/find_leads.py --city "Getafe" --type restaurante --limit 40

Tipos soportados: bar, restaurante, cafeteria, panaderia, peluqueria, dental, estetica,
floristeria, fisioterapia, unas, taller, gimnasio, autoescuela, veterinario, abogado,
inmobiliaria
"""
import argparse
import csv
import os
import time
from pathlib import Path

import re
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

# Google devuelve en websiteUri cualquier enlace "oficial" del negocio, y muy a
# menudo es un perfil de Instagram/Facebook, una ficha en un directorio o la web
# corporativa de una franquicia — no una web propia. Para elegir bien el mensaje
# (primera web vs. renovar la que tienen) hay que distinguirlo.
WEB_SOCIAL = (
    "facebook.com", "instagram.com", "tiktok.com", "twitter.com", "x.com",
    "youtube.com", "youtu.be", "linktr.ee", "linktree.", "t.me", "wa.me",
    "whatsapp.com", "pinterest.", "linkedin.com",
)
WEB_AGREGADOR = (
    "sites.google.com", "business.site", "google.com", "goo.gl", "tripadvisor.",
    "thefork.", "eltenedor.", "just-eat.", "ubereats.", "glovoapp.", "deliveroo.",
    "doctoralia.", "milanuncios.", "idealista.", "fotocasa.", "pisos.com",
    "habitaclia.", "yelp.", "qamarero.com", "carta.menu", "iencuentro.es",
    "getafeonline.es", "unplanperfecto.es", "paginasamarillas.",
)
WEB_BUILDER = (
    "wixsite.com", "jimdosite.com", "jimdo.com", "webnode.", "blogspot.com",
    "wordpress.com", "godaddysites.com", "negocio.site", "canva.site",
    "netlify.app", "weebly.com", "square.site", "mozello.", "webs.com",
)
WEB_FRANQUICIA = (
    "redpiso.es", "tecnocasa.es", "hogaresgroup.es", "donpiso.com",
    "alfainmobiliaria.", "look-inmobiliarias.", "remax.es", "engelvoelkers.",
    "century21.es", "gilmar.es", "expofincas.",
)


def _host_casa(host, token):
    """token con '.' final => prefijo de subdominio (linktree., pinterest.).
    token normal => dominio exacto: host == token o subdominio de token."""
    if token.endswith("."):
        return host.startswith(token) or ("." + token) in host
    return host == token or host.endswith("." + token)


def clasificar_web(url):
    """Devuelve el tipo de presencia web: propia / builder / franquicia /
    social / agregador / ninguna."""
    if not url or not url.strip():
        return "ninguna"
    host = (urlparse(url).hostname or url).lower()
    host = re.sub(r"^www\.", "", host)
    for grupo, etiqueta in (
        (WEB_SOCIAL, "social"),
        (WEB_AGREGADOR, "agregador"),
        (WEB_BUILDER, "builder"),
        (WEB_FRANQUICIA, "franquicia"),
    ):
        if any(_host_casa(host, t) for t in grupo):
            return etiqueta
    return "propia"


# Estados que cuentan como "tiene una web que renovar" (mensaje CON_WEB). El
# resto (social / agregador / ninguna) van con el mensaje de primera web.
WEB_ESTADOS_CON_WEB = ("propia", "builder", "franquicia")

API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PHOTO_URL_TMPL = "https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=1200&key={key}"

TYPE_MAP = {
    "bar": {"query_es": "bares", "included_type": "bar", "label": "Bar"},
    "restaurante": {"query_es": "restaurantes", "included_type": "restaurant", "label": "Restaurante"},
    "cafeteria": {"query_es": "cafeterias", "included_type": "cafe", "label": "Cafeteria"},
    "panaderia": {"query_es": "panaderias", "included_type": "bakery", "label": "Panaderia"},
    "peluqueria": {"query_es": "peluquerias", "included_type": "hair_care", "label": "Peluqueria"},
    "dental": {"query_es": "clinicas dentales", "included_type": "dentist", "label": "Dental"},
    "estetica": {"query_es": "centros de estetica", "included_type": "beauty_salon", "label": "Estetica"},
    "floristeria": {"query_es": "floristerias", "included_type": "florist", "label": "Floristeria"},
    "fisioterapia": {"query_es": "clinicas de fisioterapia", "included_type": "physiotherapist", "label": "Fisioterapia"},
    "unas": {"query_es": "salones de unas", "included_type": "nail_salon", "label": "Unas"},
    "taller": {"query_es": "talleres mecanicos", "included_type": "car_repair", "label": "Taller"},
    "autoescuela": {"query_es": "autoescuelas", "included_type": None, "label": "Autoescuela"},
    "veterinario": {"query_es": "clinicas veterinarias", "included_type": "veterinary_care", "label": "Veterinario"},
    "abogado": {"query_es": "abogados", "included_type": "lawyer", "label": "Abogado"},
    "inmobiliaria": {"query_es": "inmobiliarias", "included_type": "real_estate_agency", "label": "Inmobiliaria"},
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
    body = {"textQuery": query_text, "languageCode": "es"}
    if included_type:
        body["includedType"] = included_type
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
        web_estado = clasificar_web(website)
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
            # tiene_web = tiene una web que se pueda renovar (propia/builder/
            # franquicia). Un perfil de redes o una ficha en un directorio NO
            # cuentan: esos van con el mensaje de "primera web".
            "tiene_web": web_estado in WEB_ESTADOS_CON_WEB,
            "web_estado": web_estado,
            "rating": place.get("rating", ""),
            "review_count": place.get("userRatingCount", ""),
            "photo_path": photo_path,
        })

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else [
            "place_id", "business_name", "type_label", "city", "address", "phone",
            "website", "tiene_web", "web_estado", "rating", "review_count", "photo_path",
        ])
        writer.writeheader()
        writer.writerows(rows)

    sin_web = sum(1 for r in rows if not r["tiene_web"])
    reparto = ", ".join(
        f"{k}:{sum(1 for r in rows if r['web_estado'] == k)}"
        for k in ("propia", "builder", "franquicia", "social", "agregador", "ninguna")
        if any(r["web_estado"] == k for r in rows)
    )
    print(f"Guardado {csv_path} — {len(rows)} negocios ({sin_web} para 'primera web', "
          f"{len(rows) - sin_web} para 'renovar'). Reparto: {reparto}")


if __name__ == "__main__":
    main()
