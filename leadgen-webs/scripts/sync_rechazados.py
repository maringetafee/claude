"""
Sincroniza los leads marcados como "rechazado" en Netlify Blobs (a mano
desde el panel, o solos por la regla de 15 dias de netlify/functions/
auto-rechazar.mjs) con los CSV locales:

1. Los añade (si no estaban) a leads/rechazados.csv, la lista negra que
   find_leads.py consulta para no volver a proponer el mismo negocio.
2. Los elimina de output/*_borradores.csv para que desaparezcan del panel
   en el proximo build (la desaparicion inmediata en pantalla ya la hace
   el JavaScript del panel al cargar; esto es la limpieza real del CSV
   versionado).

Uso:
    netlify blobs:get estados overrides -O /tmp/overrides.json
    python scripts/sync_rechazados.py /tmp/overrides.json
"""
import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
RECHAZADOS_CSV = ROOT / "leads" / "rechazados.csv"
RECHAZADOS_FIELDS = [
    "place_id", "business_name", "phone", "city", "type_label",
    "slug", "motivo", "fecha_rechazo",
]


def cargar_rechazados_existentes():
    if not RECHAZADOS_CSV.exists():
        return {}
    with RECHAZADOS_CSV.open(encoding="utf-8") as f:
        return {row["slug"]: row for row in csv.DictReader(f)}


def cargar_borradores():
    """{slug: row} de todos los output/*_borradores.csv, para sacar
    business_name/phone/tipo del lead rechazado."""
    borradores = {}
    for csv_path in ROOT.glob("output/*_borradores.csv"):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if row.get("slug"):
                    borradores[row["slug"]] = row
    return borradores


def cargar_leads_por_slug():
    """{slug: row} de todos los leads/*.csv, recalculando el slug igual que
    generate_email_drafts.py (slugify(business_name-city)) porque esos CSV
    no traen la columna slug — de ahi sacamos place_id y city."""
    leads = {}
    for csv_path in ROOT.glob("leads/*.csv"):
        if csv_path.name == "rechazados.csv":
            continue
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if not row.get("business_name"):
                    continue
                slug = slugify(f"{row['business_name']}-{row.get('city', '')}")
                leads[slug] = row
    return leads


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/sync_rechazados.py <overrides.json>")

    overrides = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    rechazados_slugs = {slug for slug, info in overrides.items() if info.get("estado") == "rechazado"}

    if not rechazados_slugs:
        print("No hay ningun lead en estado 'rechazado' en Blobs. Nada que hacer.")
        return

    existentes = cargar_rechazados_existentes()
    nuevos = sorted(rechazados_slugs - existentes.keys())

    if not nuevos:
        print("La lista negra ya tiene a todos los rechazados actuales.")
    else:
        borradores = cargar_borradores()
        leads = cargar_leads_por_slug()

        filas_nuevas = []
        for slug in nuevos:
            b = borradores.get(slug, {})
            l = leads.get(slug, {})
            if not b and not l:
                print(f"  aviso: no encuentro datos de {slug} en ningun CSV, lo anoto solo con el slug")
            filas_nuevas.append({
                "place_id": l.get("place_id", ""),
                "business_name": b.get("business_name") or l.get("business_name") or slug,
                "phone": b.get("phone") or l.get("phone", ""),
                "city": l.get("city", ""),
                "type_label": b.get("tipo") or l.get("type_label", ""),
                "slug": slug,
                "motivo": overrides[slug].get("motivo", "manual"),
                "fecha_rechazo": overrides[slug].get("updatedAt", datetime.now(timezone.utc).isoformat()),
            })

        escribir_cabecera = not RECHAZADOS_CSV.exists()
        with RECHAZADOS_CSV.open("a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=RECHAZADOS_FIELDS)
            if escribir_cabecera:
                writer.writeheader()
            writer.writerows(filas_nuevas)
        print(f"Añadidos {len(filas_nuevas)} lead(s) nuevos a leads/rechazados.csv")

    eliminados_total = 0
    for csv_path in sorted(ROOT.glob("output/*_borradores.csv")):
        with csv_path.open(encoding="utf-8") as f:
            reader = csv.DictReader(f)
            filas = list(reader)
            fields = reader.fieldnames
        restantes = [r for r in filas if r.get("slug") not in rechazados_slugs]
        eliminadas = len(filas) - len(restantes)
        if eliminadas:
            with csv_path.open("w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fields)
                writer.writeheader()
                writer.writerows(restantes)
            eliminados_total += eliminadas
            print(f"  {csv_path.name}: -{eliminadas} lead(s) rechazado(s)")

    print(f"Total eliminados de output/*_borradores.csv: {eliminados_total}")
    print("Ahora toca: python scripts/build_site.py + netlify deploy (o commit si ya estaba desplegado).")


if __name__ == "__main__":
    main()
