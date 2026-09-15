"""
Selecciona texto e imagen rotando entre opciones fijas y publica via post_social.
Pensado para ejecutarse automaticamente desde el Programador de tareas de Windows
(lunes, miercoles y viernes a las 10:00), sin intervencion humana.
"""
import json
import os

from post_social import load_env, post_to_facebook, post_to_instagram

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_PATH = os.path.join(SCRIPT_DIR, "auto_post_state.json")

CAPTIONS = [
    "Webs a medida para negocios locales de Getafe, listas en 24/48h. Sin plantillas genericas, sin sorpresas en el precio. Descubrelo en makemyweb.es",
    "Reservas 24/7 sin depender del telefono: tu web sigue trabajando mientras tu duermes. Hablamos de la tuya? makemyweb.es",
    "Ficha de Google Business optimizada para que te encuentren cuando te buscan. Es lo primero que miramos al lanzar cualquier web. makemyweb.es",
    "Mantenimiento web incluido: actualizaciones y seguridad sin coste extra ni sustos. Tu solo dedicate a tu negocio. makemyweb.es",
    "Diseno y entrega en 24/48h. Sin procesos eternos ni presupuestos que tardan semanas. makemyweb.es",
    "Mocca, La Esquinita, SBS Telecomunicaciones, Lolita... negocios reales de Getafe que ya confian en su web. El siguiente puede ser el tuyo. makemyweb.es",
]

IMAGES = [
    "https://makemyweb.es/assets/images/work-mocca.jpg",
    "https://makemyweb.es/assets/images/work-esquinita.jpg",
    "https://makemyweb.es/assets/images/work-lolita.jpg",
    "https://makemyweb.es/assets/images/work-sbs.jpg",
]


def load_state():
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {"caption_index": 0, "image_index": 0}


def save_state(state):
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f)


def main():
    state = load_state()
    caption = CAPTIONS[state["caption_index"] % len(CAPTIONS)]
    image_url = IMAGES[state["image_index"] % len(IMAGES)]

    env = load_env()
    fb_result = post_to_facebook(env, caption, image_url)
    print("Facebook:", fb_result)
    ig_result = post_to_instagram(env, caption, image_url)
    print("Instagram:", ig_result)

    state["caption_index"] = (state["caption_index"] + 1) % len(CAPTIONS)
    state["image_index"] = (state["image_index"] + 1) % len(IMAGES)
    save_state(state)


if __name__ == "__main__":
    main()
