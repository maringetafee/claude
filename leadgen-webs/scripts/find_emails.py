"""
Para los leads que SI tienen web, intenta sacar un email de contacto
rastreando su pagina de inicio (y /contacto si existe) en busca de
enlaces mailto: o direcciones de email visibles.

Los leads SIN web no tienen email que rastrear por este metodo: quedan
marcados como "contactar_por_telefono" para que el envio de la propuesta
se haga por whatsapp/llamada en vez de email.

Uso:
    python scripts/find_emails.py leads/getafe_restaurante.csv
"""
import csv
import re
import sys
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
IGNORE_SUBSTR = ("sentry", "wixpress", "example.com", "godaddy", "yourdomain")
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; lead-research/1.0)"}


def extract_emails(html):
    soup = BeautifulSoup(html, "html.parser")
    found = set()

    for a in soup.select("a[href^=mailto]"):
        addr = a["href"].split("mailto:")[1].split("?")[0].strip()
        if addr:
            found.add(addr.lower())

    for match in EMAIL_RE.findall(soup.get_text(" ")):
        found.add(match.lower())

    return {e for e in found if not any(bad in e for bad in IGNORE_SUBSTR)}


def try_fetch(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            return resp.text
    except requests.RequestException:
        pass
    return ""


def find_email_for_site(website):
    if not website:
        return ""
    html = try_fetch(website)
    if not html:
        return ""
    emails = extract_emails(html)
    if emails:
        return sorted(emails)[0]

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
            emails = extract_emails(html2)
            if emails:
                return sorted(emails)[0]

    return ""


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/find_emails.py leads/<archivo>.csv")

    csv_path = Path(sys.argv[1])
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))

    for row in rows:
        if row.get("tiene_web") in ("True", "1", True):
            email = find_email_for_site(row["website"])
            row["email"] = email
            row["contactar_por_telefono"] = not bool(email)
            print(f"{row['business_name']}: {email or '(sin email encontrado, usar telefono)'}")
        else:
            row["email"] = ""
            row["contactar_por_telefono"] = True
            print(f"{row['business_name']}: sin web -> contactar por telefono")

    fieldnames = list(rows[0].keys())
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nActualizado {csv_path}")


if __name__ == "__main__":
    main()
