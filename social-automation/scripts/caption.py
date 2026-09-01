"""Generate an Instagram/Facebook caption for a piece of content using the Claude API."""
import json
import os
import urllib.request

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
MODEL = "claude-sonnet-5"

DEFAULT_NICHE = (
    "Somos una agencia que diseña y desarrolla paginas web para negocios "
    "(restaurantes, inmobiliarias, peluquerias, tiendas locales, etc.). "
    "Vendemos paginas web modernas, rapidas y que generan clientes."
)


def build_prompt(niche: str, extra_context: str | None, filename: str) -> str:
    context_line = f"\nContexto especifico de esta imagen/video: {extra_context}" if extra_context else ""
    return f"""Eres el community manager de un negocio con este perfil:
{niche}
{context_line}

Vas a publicar el archivo "{filename}" en Instagram y Facebook.

Escribe UNA caption en espanol de España, tono cercano y profesional, para vender el
servicio de paginas web y atraer clientes potenciales. Incluye una llamada a la accion
clara al final (ej: escribir por DM, visitar el enlace en la bio, pedir presupuesto).
Añade entre 4 y 8 hashtags relevantes en español al final, en una linea aparte.

No uses comillas ni markdown. Responde SOLO con el texto final de la caption, nada mas."""


def generate_caption(niche: str, extra_context: str | None, filename: str) -> str:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return (
            f"Descubre como una pagina web profesional puede llevar tu negocio al "
            f"siguiente nivel. Escribenos y te hacemos un presupuesto sin compromiso.\n\n"
            f"#paginaweb #diseñoweb #marketingdigital #negocioslocales"
        )

    payload = {
        "model": MODEL,
        "max_tokens": 400,
        "messages": [
            {"role": "user", "content": build_prompt(niche, extra_context, filename)}
        ],
    }
    req = urllib.request.Request(
        ANTHROPIC_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "content-type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": ANTHROPIC_VERSION,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    return "".join(block.get("text", "") for block in data.get("content", [])).strip()
