"""
Vuelca los leads (de todas las leads/*.csv) a local-business-system, para
que genere una demo personalizada por lead reutilizando la arquitectura de
su plantilla maestra (Lolita/LÚMINA/Studio X) en vez de las plantillas
Jinja antiguas.

Escribe local-business-system/src/data/leads/leads.json y copia las fotos
de portada a local-business-system/public/img/<slug>.jpg.

Uso:
    python scripts/sync_to_local_business_system.py
"""
import csv
import json
import shutil
from pathlib import Path

from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
LOCAL_BUSINESS_SYSTEM = ROOT.parent / "local-business-system"

TIPOS_SOPORTADOS = {"Restaurante"}
# Nota: "Peluqueria" se genera ahora con scripts/personalize_peluquerias.py
# (plantillas estaticas mujer/hombre), no con el motor Next.js/Studio X, asi
# que ya no esta en este set — de lo contrario un rebuild de Next.js
# sobreescribiria esas paginas. "Floristeria"/"Unas" tampoco tienen config en
# leadConfig.ts; se generan con scripts/personalize_static.py. "Bar" se paso
# de Casa Manolo (Next.js) a scripts/personalize_static.py con la plantilla
# static-templates/bar/ por el mismo motivo — sacarlo de aqui evita que un
# rebuild de Next.js (hecho por otro motivo, ej. Restaurante) sobreescriba
# las paginas de bares ya generadas con la plantilla estatica.


def main():
    if not LOCAL_BUSINESS_SYSTEM.exists():
        raise SystemExit(f"No encuentro {LOCAL_BUSINESS_SYSTEM} — ajusta la ruta en el script.")

    out_img = LOCAL_BUSINESS_SYSTEM / "public" / "img"
    out_img.mkdir(parents=True, exist_ok=True)
    out_json = LOCAL_BUSINESS_SYSTEM / "src" / "data" / "leads" / "leads.json"

    leads = []
    con_foto = 0
    for csv_path in sorted(ROOT.glob("leads/*.csv")):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                tipo = row.get("type_label", "")
                if tipo not in TIPOS_SOPORTADOS:
                    continue

                slug = slugify(f"{row['business_name']}-{row['city']}")
                photo_path = row.get("photo_path", "")
                has_photo = bool(photo_path and Path(photo_path).exists())
                if has_photo:
                    shutil.copy(photo_path, out_img / f"{slug}.jpg")
                    con_foto += 1

                leads.append({
                    "slug": slug,
                    "businessName": row["business_name"],
                    "tipo": tipo,
                    "city": row["city"],
                    "address": row.get("address", ""),
                    "phone": row.get("phone", ""),
                    "hasPhoto": has_photo,
                })

    out_json.write_text(json.dumps(leads, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Escrito {out_json} — {len(leads)} leads ({con_foto} con foto).")
    print("Ahora en local-business-system: npm run build, y luego copia los <slug>.html + _next/ + img/ generados a leadgen-webs/output/sites/.")


if __name__ == "__main__":
    main()
