"""
Para los leads que tienen web propia (o de constructor tipo Wix/Jimdo),
descarga la home y puntua senales de "web anticuada / abandonada":

  - sin <meta viewport>        -> no responsive (pre-2015)         [fuerte]
  - solo http, sin https        -> sin certificado                  [fuerte]
  - copyright con anyo <= hoy-3 -> sin tocar en anyos               [fuerte si <= hoy-5]
  - marcado obsoleto            -> <font>, <center>, <marquee>,
                                   bgcolor=, framesets, .swf/Flash  [medio]
  - "en construccion" / "proximamente"                              [medio]
  - constructor gratis (web_estado=builder)                         [medio]
  - pagina minuscula (<800 chars de texto visible)                  [medio]

Regla: web_obsoleta = "si" con >=1 senal fuerte o >=2 medias; "no" si
carga bien y no dispara nada; "?" si no se pudo cargar.

Escribe dos columnas nuevas en el CSV: web_obsoleta, web_motivos.

Uso:  python scripts/check_web_obsoleta.py leads/getafe_restaurante.csv [...]
"""
import csv
import datetime
import io
import re
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; lead-research/1.0)"}
ANYO = datetime.date.today().year
TIMEOUT = 15


def analizar(url, web_estado):
    fuertes, medias = [], []
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
        final = r.url
        html = r.text or ""
    except Exception as e:
        return "?", f"no carga ({type(e).__name__})"

    if r.status_code >= 400:
        return "?", f"HTTP {r.status_code}"

    low = html.lower()
    soup = BeautifulSoup(html, "html.parser")
    texto = soup.get_text(" ", strip=True)

    # --- senales fuertes ---
    if not soup.find("meta", attrs={"name": re.compile("viewport", re.I)}):
        fuertes.append("sin viewport (no responsive)")

    if final.startswith("http://") and not final.startswith("https://"):
        fuertes.append("sin https")

    anyos = [int(y) for y in re.findall(r"(?:©|&copy;|copyright|&#169;)\s*\.?\s*(20\d{2})", low)]
    anyos += [int(y) for y in re.findall(r"20\d{2}\s*[-–]\s*(20\d{2})", low)]
    anyos = [y for y in anyos if y <= ANYO]
    if anyos:
        ultimo = max(anyos)
        # el copyright rancio es senal SOLO si es muy viejo: mucha web activa
        # se deja el anyo sin actualizar.
        if ultimo <= ANYO - 8:
            fuertes.append(f"copyright {ultimo}")
        elif ultimo <= ANYO - 5:
            medias.append(f"copyright {ultimo}")

    if re.search(r"en construcci[oó]n|under construction|pr[oó]ximamente|web en desarrollo|sitio web en preparaci", low):
        fuertes.append("en construccion")

    # --- senales medias ---
    obsoleto = set()
    for nombre, pat in (("font", r"<font\b"), ("center", r"<center\b"), ("marquee", r"<marquee\b"),
                        ("bgcolor", r'bgcolor\s*='), ("frameset", r"<frameset\b"), ("flash", r"\.swf\b")):
        if re.search(pat, low):
            obsoleto.add(nombre)
    # framesets y flash son de por si letales; el resto solo cuenta en grupo
    if {"frameset", "flash"} & obsoleto:
        fuertes.append("marcado obsoleto: " + ", ".join(sorted(obsoleto)))
    elif len(obsoleto) >= 2:
        medias.append("marcado obsoleto: " + ", ".join(sorted(obsoleto)))

    if web_estado == "builder":
        medias.append("constructor gratis")

    if len(texto) < 700:
        medias.append(f"pagina minima ({len(texto)} chars)")

    # 'si' con >=1 senal fuerte, o >=3 medias (varias cosas menores a la vez)
    if fuertes or len(medias) >= 3:
        veredicto = "si"
    else:
        veredicto = "no"
    motivos = "; ".join(fuertes + medias) or "web moderna"
    return veredicto, motivos


def procesar(path):
    rows = list(csv.DictReader(io.open(path, encoding="utf-8")))
    if not rows:
        print(f"{path}: vacio")
        return
    n = si = no = q = 0
    for r in rows:
        w = (r.get("website") or "").strip()
        est = r.get("web_estado", "")
        if w and est in ("propia", "builder"):
            v, m = analizar(w, est)
            n += 1
            si += v == "si"
            no += v == "no"
            q += v == "?"
        else:
            v, m = "", ""
        r["web_obsoleta"] = v
        r["web_motivos"] = m

    hdr = list(rows[0].keys())
    for c in ("web_obsoleta", "web_motivos"):
        if c not in hdr:
            hdr.append(c)
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        wr = csv.DictWriter(f, fieldnames=hdr)
        wr.writeheader()
        wr.writerows(rows)
    print(f"{Path(path).name}: {n} webs analizadas -> {si} obsoletas, {no} modernas, {q} sin respuesta")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Uso: python scripts/check_web_obsoleta.py leads/<archivo>.csv [...]")
    for p in sys.argv[1:]:
        procesar(p)
