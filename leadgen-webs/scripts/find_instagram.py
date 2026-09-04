"""
Busca el Instagram de cada lead. Dos fuentes automaticas:

1. Si el campo "website" de Google Places YA es un link de instagram.com
   (muy comun en negocios pequenos que ponen su perfil de Instagram como
   "web" en su ficha de Google) -> se usa directamente.
2. Si tienen una web real, se rastrea la portada (y /contacto) en busca de
   un enlace a instagram.com, igual que find_emails.py hace con mailto:.

Los que no tienen web y no aparecen por ninguna de las dos vias quedan
marcados como "necesita_busqueda_manual=True" para buscarlos a mano
(Google Maps / Instagram) en un paso aparte.

Uso:
    python scripts/find_instagram.py leads/getafe_floristeria.csv
"""
import csv
import re
import sys
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

IG_RE = re.compile(r"https?://(?:www\.)?instagram\.com/([a-zA-Z0-9_.]+)/?")
IGNORE_HANDLES = {"explore", "accounts", "p", "reel", "reels", "stories", "share"}
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; lead-research/1.0)"}


def normalize_ig(url):
    m = IG_RE.search(url)
    if not m:
        return ""
    handle = m.group(1)
    if handle.lower() in IGNORE_HANDLES:
        return ""
    return f"https://instagram.com/{handle}"


def try_fetch(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            return resp.text
    except requests.RequestException:
        pass
    return ""


def find_ig_in_html(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True):
        href = urljoin(base_url, a["href"])
        ig = normalize_ig(href)
        if ig:
            return ig
    return ""


def find_instagram_for_site(website):
    html = try_fetch(website)
    if not html:
        return ""
    ig = find_ig_in_html(html, website)
    if ig:
        return ig

    soup = BeautifulSoup(html, "html.parser")
    contact_link = None
    for a in soup.find_all("a", href=True):
        text = (a.get_text() or "").lower()
        href = a["href"].lower()
        if "contact" in text or "contacto" in text or "contact" in href or "contacto" in href:
            contact_link = urljoin(website, a["href"])
            break

    if contact_link:
        html2 = try_fetch(contact_link)
        if html2:
            return find_ig_in_html(html2, contact_link)

    return ""


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/find_instagram.py leads/<archivo>.csv")

    csv_path = Path(sys.argv[1])
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))

    for row in rows:
        website = row.get("website", "")
        direct_ig = normalize_ig(website) if website else ""

        if direct_ig:
            row["instagram"] = direct_ig
            row["necesita_busqueda_manual"] = False
            print(f"{row['business_name']}: {direct_ig} (era su 'web' en Google)")
        elif row.get("tiene_web") in ("True", "1", True) and website:
            ig = find_instagram_for_site(website)
            row["instagram"] = ig
            row["necesita_busqueda_manual"] = not bool(ig)
            print(f"{row['business_name']}: {ig or '(sin IG en su web, buscar a mano)'}")
        else:
            row["instagram"] = ""
            row["necesita_busqueda_manual"] = True
            print(f"{row['business_name']}: sin web -> buscar a mano")

    fieldnames = list(rows[0].keys())
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    con_ig = sum(1 for r in rows if r["instagram"])
    manual = sum(1 for r in rows if r["necesita_busqueda_manual"] in (True, "True"))
    print(f"\nActualizado {csv_path} — {con_ig} con Instagram encontrado, {manual} necesitan busqueda manual.")


if __name__ == "__main__":
    main()
