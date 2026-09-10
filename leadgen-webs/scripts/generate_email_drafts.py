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

Soy Mario, diseño y desarrollo páginas web para negocios locales en {city}.

He visto **{business_name}** y me he tomado la libertad de preparar una propuesta visual de cómo podría quedar vuestra web:

 {preview_link}

La demo está pensada específicamente para vuestro negocio, con contenido de ejemplo para que podáis haceros una idea de cómo se vería. Si os gusta el resultado, puedo desarrollar la web completa con **vuestras fotos, información, servicios y datos reales**, encargándome de todo el proceso para que vosotros no tengáis que preocuparos de nada.

**Podéis echarle un vistazo sin ningún compromiso.**

Si os gusta la propuesta, hablamos y os paso el presupuesto.

Un saludo,

Mario
644434860
makemyweb.es
"""

# Varias variantes de redaccion para el mismo gancho (sin web propia). Mandar
# el mismo texto literal a decenas de contactos seguidos es justo el patron
# que dispara los filtros antispam de WhatsApp (ver feedback_whatsapp_spam_restriction
# en memoria) - rotamos entre variantes para que no sea un texto idéntico.
TEMPLATE_WHATSAPP_VARIANTES = [
    """Hola buenas, soy Mario. He visto {business_name} y me he fijado en que no tenéis una web propia.

Estoy creando páginas web para negocios de {city} y me animé a prepararos una demo gratuita y personalizada de cómo podría quedar la vuestra:

{preview_link}

La he hecho pensando específicamente en vuestro negocio, para que podáis verla sin ningún compromiso.

Si os gusta la idea, me encargo de desarrollar la web completa con vuestros datos, imágenes y servicios, para que vosotros no tengáis que preocuparos de nada.

Muchas gracias.""",
    """¡Hola! Soy Mario, diseño páginas web para negocios de {city}. Vi {business_name} y noté que todavía no tenéis página propia, así que os preparé una demo de muestra sin compromiso:

{preview_link}

Está pensada específicamente para vuestro negocio. Si os convence, me encargo de terminarla con vuestras fotos, textos y servicios reales.

¡Un saludo!""",
    """Hola, soy Mario. Trabajo haciendo páginas web para negocios locales de {city} y he preparado una muestra gratuita pensada para {business_name}, que vi que aún no tiene web propia:

{preview_link}

Es solo un boceto para que os hagáis una idea; si os gusta cómo queda, la completo con vuestra información real y sin ningún compromiso por vuestra parte.

Gracias por vuestro tiempo.""",
]

# Variantes para leads que YA tienen web (tiene_web=True): no se puede decir que
# "no tienen web propia" porque seria falso, asi que el gancho es ofrecer una
# renovacion/mejora en vez de una primera web.
TEMPLATE_WHATSAPP_CON_WEB_VARIANTES = [
    """Hola buenas, soy Mario. He visto la web de {business_name} y me animé a prepararos una propuesta gratuita de cómo podría quedar renovada, con un diseño más moderno y pensado para conseguir más clientes:

{preview_link}

La he hecho pensando específicamente en vuestro negocio, para que podáis compararla con la actual sin ningún compromiso.

Si os gusta la idea, me encargo de desarrollar la web completa con vuestros datos, imágenes y servicios, para que vosotros no tengáis que preocuparos de nada.

Muchas gracias.""",
    """¡Hola! Soy Mario. Vi la web de {business_name} y se me ocurrió preparar una versión renovada, con un diseño más actual pensado para atraer más clientes en {city}:

{preview_link}

Es una propuesta sin compromiso, solo para que veáis cómo podría quedar. Si os gusta, me encargo de completarla con vuestros datos reales.

¡Un saludo!""",
    """Hola, soy Mario, diseño y renuevo páginas web para negocios de {city}. Al ver la web de {business_name} pensé que podría beneficiarse de un diseño más moderno, así que preparé esta propuesta gratuita:

{preview_link}

Podéis compararla con la actual sin ningún compromiso; si os convence, la termino con vuestra información real.

Gracias por vuestro tiempo.""",
]


def elegir_variante(variantes, business_name):
    # Indice estable (no aleatorio) para que regenerar el CSV no cambie el
    # texto ya usado con un lead, pero distintos leads caigan en distintas
    # variantes.
    indice = sum(ord(c) for c in business_name) % len(variantes)
    return variantes[indice]


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
        # Netlify sirve la misma pagina con y sin ".html" (pretty URLs); para
        # WhatsApp queda mas limpio sin la extension.
        preview_link_whatsapp = preview_link[:-len(".html")] if preview_link.endswith(".html") else preview_link

        subject = TEMPLATE_SUBJECT.format(business_name=row["business_name"])
        body = TEMPLATE_BODY.format(
            business_name=row["business_name"],
            city=row["city"],
            preview_link=preview_link,
        )
        tiene_web = row.get("tiene_web") in ("True", "1", True)
        variantes = TEMPLATE_WHATSAPP_CON_WEB_VARIANTES if tiene_web else TEMPLATE_WHATSAPP_VARIANTES
        template_whatsapp = elegir_variante(variantes, row["business_name"])
        mensaje_whatsapp = template_whatsapp.format(
            business_name=row["business_name"],
            city=row["city"],
            preview_link=preview_link_whatsapp,
        )

        email = row.get("email", "")
        contactar_telefono = row.get("contactar_por_telefono") in ("True", "1", True) or not email

        drafts.append({
            "business_name": row["business_name"],
            "tipo": row.get("type_label", ""),
            "slug": slug,
            "email": email,
            "phone": row.get("phone", ""),
            "instagram": row.get("instagram", ""),
            "contactar_por_telefono": contactar_telefono,
            "preview_link": preview_link,
            "estado": estados_previos.get(slug, "pendiente"),
            "asunto": subject,
            "cuerpo": body,
            "mensaje_whatsapp": mensaje_whatsapp,
        })

    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(drafts[0].keys()) if drafts else [])
        writer.writeheader()
        writer.writerows(drafts)

    con_email = sum(1 for d in drafts if d["email"])
    print(f"Guardado {out_path} — {con_email} con email listo, {len(drafts) - con_email} necesitan contacto por telefono/whatsapp.")
    print("Cada fila trae 'asunto'/'cuerpo' (email) y 'mensaje_whatsapp' (version corta) listos para copiar.")
    print("Recuerda: revisa el texto del email (sustituye [TU NOMBRE]/[TU TELEFONO]) antes de enviar nada.")
    print("Marca la columna 'estado' (pendiente/enviado/respondido/cliente/rechazado) segun avances, y luego ejecuta build_site.py para actualizar el indice.")


if __name__ == "__main__":
    main()
