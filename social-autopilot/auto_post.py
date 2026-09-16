"""
Publica automaticamente en Facebook e Instagram usando pares fijos de
texto (con CTA a WhatsApp) + captura real de un proyecto de MakeMyWeb.
Pensado para ejecutarse desde el Programador de tareas de Windows
(lunes, miercoles y viernes a las 10:00), sin intervencion humana.

Cada ejecucion consume un elemento de una cola barajada (persistida en
auto_post_state.json) que recorre todos los POSTS sin repetir ninguno
hasta haberlos usado todos; al agotarse, se vuelve a barajar.
"""
import json
import os
import random

from post_social import load_env, post_to_facebook, post_to_instagram

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_PATH = os.path.join(SCRIPT_DIR, "auto_post_state.json")

RAW_BASE = "https://raw.githubusercontent.com/maringetafee/claude/main/social-autopilot/assets"
WHATSAPP = "https://wa.me/34689872320"

POSTS = [
    {
        "image": f"{RAW_BASE}/esquinita.jpg",
        "caption": (
            "La Esquinita ya tiene su web: carta digital con mas de 70 platos, "
            "filtro de alergenos y toda la esencia del bar de siempre. Si tu "
            f"negocio en Getafe aun no tiene la suya, hablamos -> {WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/lolitagetafe.jpg",
        "caption": (
            "Reservas de mesa online, sin llamadas ni esperas: asi funciona la "
            "web que hicimos para Lolita Cafe. Si quieres una asi para tu "
            f"negocio, escribenos -> {WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/moccacafe.jpg",
        "caption": (
            "Mocca Cafe paso de depender solo de Instagram a tener su propia "
            "web con carta y ubicacion siempre a mano. Cuentanos tu caso -> "
            f"{WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/sbs-telecom.jpg",
        "caption": (
            "50 anos de experiencia real, ahora con una web a la altura: asi "
            "digitalizamos a S.B.S Telecomunicaciones. Si tu web no representa "
            f"lo que haces, hablemos -> {WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/coronas-y-flores.jpg",
        "caption": (
            "De catalogo en fotos sueltas a tienda online con pago y pedidos "
            "automaticos: la nueva web de Coronas y Flores ya vende sola. Tu "
            f"negocio tambien podria -> {WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/moccacafe.jpg",
        "caption": (
            "Mientras tu cierras el negocio, tu web puede seguir trabajando: "
            "reservas y pedidos 24/7, sin depender del telefono. Te lo "
            f"mostramos -> {WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/coronas-y-flores.jpg",
        "caption": (
            "Actualizaciones, seguridad y cambios pequenos, incluidos sin "
            "coste extra ni sorpresas. Asi cuidamos las webs que hacemos en "
            f"MakeMyWeb -> {WHATSAPP}"
        ),
    },
    {
        "image": f"{RAW_BASE}/sbs-telecom.jpg",
        "caption": (
            "Diseno y entrega de tu web en 24/48h, sin procesos eternos. "
            f"Cuentanos que necesitas y te decimos como -> {WHATSAPP}"
        ),
    },
]


def load_state():
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {"queue": []}


def save_state(state):
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f)


def next_post(state):
    if not state["queue"]:
        order = list(range(len(POSTS)))
        random.shuffle(order)
        state["queue"] = order
    index = state["queue"].pop(0)
    return POSTS[index]


def main():
    state = load_state()
    post = next_post(state)

    env = load_env()
    fb_result = post_to_facebook(env, post["caption"], post["image"])
    print("Facebook:", fb_result)
    ig_result = post_to_instagram(env, post["caption"], post["image"])
    print("Instagram:", ig_result)

    save_state(state)


if __name__ == "__main__":
    main()
