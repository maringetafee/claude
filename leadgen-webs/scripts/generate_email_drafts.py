"""
Genera un borrador de email por lead (asunto + cuerpo), enlazando a la web
de muestra ya generada. NO envia nada — solo prepara los textos para que
los revises antes de mandarlos tu mismo (o con un paso de envio aparte que
tu apruebes explicitamente).

Requiere que PREVIEW_BASE_URL este configurado en .env (el sitio donde
vas a colgar la carpeta output/sites, ej. un despliegue de Netlify).

Uso:
    python scripts/generate_email_drafts.py leads/getafe_restaurante.csv
"""
import csv
import os
import sys
from pathlib import Path
from urllib.parse import quote

from dotenv import load_dotenv
from slugify import slugify

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

PREVIEW_BASE_URL = os.environ.get("PREVIEW_BASE_URL", "").rstrip("/")

TEMPLATE_SUBJECT = "Una propuesta de web para {business_name}"

TEMPLATE_BODY = """Hola,

Soy [TU NOMBRE], diseño y desarrollo páginas web para negocios locales en {city}.

Vi {business_name} y preparé, a modo de ejemplo, un boceto de cómo podría verse
vuestra web:

{preview_link}

Es solo una demo con contenido genérico para que os hagáis una idea del estilo;
con vuestras fotos, textos y datos reales quedaría lista en pocos días.

Si os interesa, puedo mandaros presupuesto sin compromiso. Un saludo,
[TU NOMBRE]
[TU TELEFONO]
"""


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/generate_email_drafts.py leads/<archivo>.csv")

    if not PREVIEW_BASE_URL:
        print(
            "Aviso: PREVIEW_BASE_URL no esta configurado en .env — el link de la "
            "propuesta saldra vacio hasta que despliegues output/sites en algun sitio "
            "publico (Netlify, etc.) y rellenes esa variable.\n"
        )

    csv_path = Path(sys.argv[1])
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))

    out_path = ROOT / "output" / f"{csv_path.stem}_borradores.csv"
    out_path.parent.mkdir(exist_ok=True)

    # Si ya existe un borrador previo para este lote, conserva el "estado"
    # que hayas ido actualizando a mano (pendiente/enviado/respondido/...)
    # en vez de resetearlo cada vez que se regenera el CSV.
    estados_previos = {}
    if out_path.exists():
        with out_path.open(encoding="utf-8") as f:
            for prev_row in csv.DictReader(f):
                if prev_row.get("slug"):
                    estados_previos[prev_row["slug"]] = prev_row.get("estado", "pendiente")

    drafts = []
    for row in rows:
        slug = slugify(f"{row['business_name']}-{row['city']}")
        preview_link = f"{PREVIEW_BASE_URL}/{slug}.html" if PREVIEW_BASE_URL else "[FALTA DESPLEGAR output/sites]"

        subject = TEMPLATE_SUBJECT.format(business_name=row["business_name"])
        body = TEMPLATE_BODY.format(
            business_name=row["business_name"],
            city=row["city"],
            preview_link=preview_link,
        )

        email = row.get("email", "")
        contactar_telefono = row.get("contactar_por_telefono") in ("True", "1", True) or not email

        drafts.append({
            "business_name": row["business_name"],
            "tipo": row.get("type_label", ""),
            "slug": slug,
            "email": email,
            "phone": row.get("phone", ""),
            "contactar_por_telefono": contactar_telefono,
            "preview_link": preview_link,
            "estado": estados_previos.get(slug, "pendiente"),
            "asunto": subject,
            "cuerpo": body,
        })

    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(drafts[0].keys()) if drafts else [])
        writer.writeheader()
        writer.writerows(drafts)

    con_email = sum(1 for d in drafts if d["email"])
    print(f"Guardado {out_path} — {con_email} con email listo, {len(drafts) - con_email} necesitan contacto por telefono/whatsapp.")
    print("Recuerda: revisa y edita los textos (sustituye [TU NOMBRE]/[TU TELEFONO]) antes de enviar nada.")
    print("Marca la columna 'estado' (pendiente/enviado/respondido/cliente/rechazado) segun avances, y luego ejecuta build_site.py para actualizar el indice.")


if __name__ == "__main__":
    main()
