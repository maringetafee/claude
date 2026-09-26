"""
Tandas de WhatsApp Business (version de 3 mensajes separados).

Lo usa la tarea programada "tanda-whatsapp-business" (10:30 y 17:30), pero
tambien vale a mano. Tres pasos:

    netlify blobs:get estados overrides -O <tmp>/overrides.json
    python scripts/wa_tanda.py sync   <tmp>/overrides.json
        -> panel (Blobs) -> CSV: copia los estados del panel a
           output/*_borradores.csv (respeta los marcadores solo-CSV
           sin_whatsapp / sin_instagram_dm) y ejecuta sync_rechazados.py.

    python scripts/wa_tanda.py pool   <tmp>/overrides.json <tmp>/tanda.json [N]
        -> elige N candidatos + reservas (pendiente, movil 6/7, sin web o web
           obsoleta, telefono nunca tocado en CSV/Blobs/lista negra), variando
           rubro, con msg1/msg2/msg3 y la URL send?phone=... ya montados.

    python scripts/wa_tanda.py marcar <tmp>/overrides.json slug=estado [...]
        -> escribe el estado en los CSV y en <tmp>/overrides.json (luego
           `netlify blobs:set estados overrides --input <tmp>/overrides.json`).
           Estados: enviado, sin_whatsapp, pendiente...
"""
import csv
import glob
import json
import random
import re
import subprocess
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = Path(__file__).resolve().parent.parent

CITY = {"alcorcon": "Alcorcón", "getafe": "Getafe", "mostoles": "Móstoles",
        "fuenlabrada": "Fuenlabrada", "leganes": "Leganés", "parla": "Parla"}
CSV_ONLY = ("sin_whatsapp", "sin_instagram_dm")

MSG1_SIN_WEB = [
    "¡Buenas! Me llamo Marco y hago páginas web para negocios de {city}. Encontré {name} en Google Maps y vi que todavía no tenéis web propia, así que os preparé una de muestra sin compromiso:",
    "¡Hola! Soy Marco, diseño páginas web para negocios de {city}. Vi {name} en Google Maps y me di cuenta de que aún no tenéis web propia, así que os he preparado una de muestra sin compromiso:",
    "¡Hola! Soy Marco y me dedico a hacer páginas web para negocios de {city}. Buscando en Google Maps encontré {name} y vi que no tenéis web propia, así que os preparé una muestra sin compromiso:",
]
MSG1_SIN_WEB_RESENAS = [
    "¡Hola! Soy Marco, diseño páginas web para negocios de {city}. Vi {name} en Google Maps y me llamó la atención que con {n} reseñas todavía no tenéis web propia, así que os preparé una de muestra sin compromiso:",
    "¡Buenas! Me llamo Marco y hago páginas web para negocios de {city}. Encontré {name} en Google Maps y me sorprendió que con {n} reseñas aún no tengáis web propia, así que os preparé una de muestra sin compromiso:",
]
MSG1_OBSOLETA = [
    "¡Hola! Soy Marco, diseño páginas web para negocios de {city}. Vi {name} en Google Maps y vi que vuestra web se ha quedado algo desactualizada, así que os preparé una muestra de cómo podría quedar, sin compromiso:",
]
MSG3_SIN_WEB = [
    "La hice pensando en vuestro negocio. Si os gusta, la termino con vuestras fotos y datos reales. ¿Le echáis un ojo y me contáis?",
    "Echadle un vistazo cuando tengáis un momento. Si os convence, me encargo de todo lo demás, y si no os interesa, sin problema. ¿Qué me decís?",
    "Es solo un punto de partida, sin ningún compromiso. Si os encaja, la completo con vuestras fotos, textos y servicios. ¿Qué os parece?",
    "Está pensada específicamente para vuestro negocio. Si os convence, la termino con vuestras fotos, textos y servicios reales. ¿La miráis y me decís qué os parece?",
]
MSG3_OBSOLETA = [
    "Está pensada para renovar vuestra web actual, manteniendo lo que ya tenéis pero con un diseño más moderno. Si os convence, la termino con vuestras fotos, textos y servicios reales. ¿La miráis y me decís qué os parece?",
]


def norm(s):
    return unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().strip().lower()


def digits(p):
    d = re.sub(r"\D", "", p or "")
    if d.startswith("34") and len(d) == 11:
        d = d[2:]
    return d


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def borradores():
    """[(path, fieldnames, rows)] de output/*_borradores.csv"""
    out = []
    for f in sorted(glob.glob(str(ROOT / "output" / "*_borradores.csv"))):
        with open(f, encoding="utf-8", newline="") as fh:
            r = csv.DictReader(fh)
            out.append((f, r.fieldnames, list(r)))
    return out


def write_csv(path, fields, rows):
    with open(path, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


def cmd_sync(overrides_path):
    blobs = load_json(overrides_path)
    cambios = 0
    for path, fields, rows in borradores():
        changed = False
        for r in rows:
            b = blobs.get(r.get("slug", ""))
            if not b:
                continue
            be, ce = b.get("estado", ""), r.get("estado", "")
            if be != ce and not (ce in CSV_ONLY and be in ("pendiente", "")):
                r["estado"] = be
                changed = True
                cambios += 1
        if changed:
            write_csv(path, fields, rows)
    print("estados copiados del panel a CSV:", cambios)
    subprocess.run([sys.executable, str(ROOT / "scripts" / "sync_rechazados.py"), overrides_path], check=True)


def cmd_pool(overrides_path, out_path, n):
    blobs = load_json(overrides_path)
    leads = {}
    for f in glob.glob(str(ROOT / "leads" / "*.csv")):
        if f.endswith("rechazados.csv"):
            continue
        with open(f, encoding="utf-8") as fh:
            for r in csv.DictReader(fh):
                leads[(norm(r.get("city")), norm(r.get("business_name")))] = r
    negra = set()
    with open(ROOT / "leads" / "rechazados.csv", encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            if r.get("phone"):
                negra.add(digits(r["phone"]))

    rows = []
    for path, _, rs in borradores():
        base = Path(path).name.replace("_borradores.csv", "")
        city_key, cat = base.split("_", 1)
        for r in rs:
            r["_file"], r["_city"], r["_cat"] = path, city_key, cat
            rows.append(r)

    tocados = set()
    for r in rows:
        est = blobs.get(r["slug"], {}).get("estado") or r.get("estado") or "pendiente"
        if est != "pendiente":
            tocados.add(digits(r.get("phone")))

    por_cat = defaultdict(list)
    vistos = set()
    for r in rows:
        est = blobs.get(r["slug"], {}).get("estado") or r.get("estado")
        if est != "pendiente":
            continue
        ph = digits(r.get("phone"))
        if not re.fullmatch(r"[67]\d{8}", ph) or ph in tocados or ph in negra or ph in vistos:
            continue
        we, wo = r.get("web_estado", ""), r.get("web_obsoleta", "")
        if we in ("ninguna", "social", "agregador", ""):
            variante = "sin_web"
        elif we in ("propia", "builder") and wo in ("si", "True", "true"):
            variante = "web_obsoleta"
        else:
            continue
        if "rosangel" in norm(r["business_name"]):
            continue
        lead = leads.get((norm(CITY[r["_city"]]), norm(r["business_name"])), {})
        try:
            rc = int(float(lead.get("review_count") or 0))
        except ValueError:
            rc = 0
        vistos.add(ph)
        por_cat[r["_cat"]].append({
            "slug": r["slug"], "business_name": r["business_name"], "cat": r["_cat"],
            "city": CITY[r["_city"]], "phone": ph, "variante": variante, "review_count": rc,
            "preview_link": r.get("preview_link", ""), "file": path,
        })

    for lst in por_cat.values():
        lst.sort(key=lambda c: -c["review_count"])
    # reparto round-robin entre rubros, empezando por los que mas candidatos tienen
    orden = sorted(por_cat, key=lambda k: -len(por_cat[k]))
    elegidos = []
    objetivo = n + max(10, n)  # reservas para sin_whatsapp / contactos guardados
    while len(elegidos) < objetivo and any(por_cat[k] for k in orden):
        for k in orden:
            if por_cat[k] and len(elegidos) < objetivo:
                elegidos.append(por_cat[k].pop(0))

    rnd = random.Random()
    for c in elegidos:
        # "Talleres X - Alcorcon", "Clinica Y | Dentista Fuenlabrada", "Z (Alcorcón)" -> nombre limpio
        name = re.split(r"\s[|·–-]\s", c["business_name"].strip())[0]
        name = re.sub(r"\s*\(([^)]*)\)$", lambda m: "" if norm(m.group(1)) in CITY else m.group(0), name)
        if norm(name.split()[-1]) == norm(c["city"]) and len(name.split()) > 1:
            name = name.rsplit(" ", 1)[0]
        c["nombre"] = name
        if c["variante"] == "web_obsoleta":
            m1 = rnd.choice(MSG1_OBSOLETA)
            m3 = rnd.choice(MSG3_OBSOLETA)
        elif c["review_count"] >= 20:
            m1 = rnd.choice(MSG1_SIN_WEB_RESENAS)
            m3 = rnd.choice(MSG3_SIN_WEB)
        else:
            m1 = rnd.choice(MSG1_SIN_WEB)
            m3 = rnd.choice(MSG3_SIN_WEB)
        c["msg1"] = m1.format(city=c["city"], name=name, n=c["review_count"])
        c["msg2"] = re.sub(r"\.html$", "", c["preview_link"])
        c["msg3"] = m3
        c["url"] = f"https://web.whatsapp.com/send?phone=34{c['phone']}&text={quote(c['msg1'], safe='')}"

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(elegidos, f, ensure_ascii=False, indent=1)
    total = sum(len(v) for v in por_cat.values()) + len(elegidos)
    print(f"candidatos totales: {total} | elegidos (con reservas): {len(elegidos)} -> {out_path}")
    print(Counter(c["cat"] for c in elegidos))
    for i, c in enumerate(elegidos, 1):
        print(i, c["slug"], "|", c["business_name"], "|", c["city"], "|", c["variante"], "|", c["phone"])


def cmd_marcar(overrides_path, pares):
    blobs = load_json(overrides_path)
    ahora = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    marcas = dict(p.split("=", 1) for p in pares)
    hechos = Counter()
    for path, fields, rows in borradores():
        changed = False
        for r in rows:
            if r.get("slug") in marcas:
                r["estado"] = marcas[r["slug"]]
                changed = True
                hechos[r["slug"]] += 1
        if changed:
            write_csv(path, fields, rows)
    for slug, est in marcas.items():
        blobs[slug] = {"estado": est, "updatedAt": ahora}
    with open(overrides_path, "w", encoding="utf-8") as f:
        json.dump(blobs, f, ensure_ascii=False)
    faltan = [s for s in marcas if s not in hechos]
    print(f"marcados: {len(marcas)} slugs, {sum(hechos.values())} filas CSV | overrides: {len(blobs)} entradas")
    if faltan:
        print("AVISO, slugs sin fila en CSV:", faltan)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "sync":
        cmd_sync(args[0])
    elif cmd == "pool":
        cmd_pool(args[0], args[1], int(args[2]) if len(args) > 2 else 15)
    elif cmd == "marcar":
        cmd_marcar(args[0], args[1:])
    else:
        print(__doc__)
        sys.exit(1)
