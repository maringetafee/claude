# social-autopilot

Publica en la Página de Facebook "Makemyweb" y en Instagram (@makemyweb.es) vía Meta Graph API v26.0, sin dependencias externas.

## Setup

Crea un archivo `.env` (no se sube a git) en esta carpeta con:

```
FB_PAGE_ID=1374240985768097
FB_PAGE_ACCESS_TOKEN=<token de página de larga duración, caduca 12 nov 2026>
IG_BUSINESS_ACCOUNT_ID=17841435071422285
```

El token sale del Graph API Explorer de la app de Meta "auto" (App ID 953815043755867, negocio makemyweb.es), con permisos: `pages_show_list`, `business_management`, `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`, `pages_manage_metadata`, `pages_manage_posts`. Se extiende a larga duración desde el Depurador de identificadores de acceso.

## Uso manual

```
python post_social.py --text "Texto del post" --image-url "https://..." [--facebook-only | --instagram-only]
```

## Automatización

Tarea del Programador de tareas de Windows `MakeMyWeb-SocialAutopilot`, en el portátil local, que ejecuta `python auto_post.py` lunes/miércoles/viernes a las 10:00 con `StartWhenAvailable` (si el PC está apagado a esa hora, se lanza en cuanto se enciende). `auto_post.py` rota entre 6 textos y 4 imágenes fijas (sin IA) y publica llamando a las funciones de `post_social.py`; guarda el índice de rotación en `auto_post_state.json` (local, no se sube a git).

Hubo un intento previo con una rutina programada en la nube de Claude (`trig_01MkBGqLJLK9JHxBeGqazBcS`) pero el entorno en la nube bloquea por política de red las llamadas salientes a `graph.facebook.com` (403 en el CONNECT) — no hay forma de añadirlo al allowlist, así que se abandonó y esa rutina quedó deshabilitada.

## Limitaciones conocidas de la API (no son bugs)

- Instagram Graph API no permite borrar publicaciones ni cambiar la foto de perfil por API. Ambas cosas hay que hacerlas a mano desde la app.
- Facebook no permite borrar por API un post que no fue creado por esta misma app (p. ej. el post automático de "cambió su foto de perfil").
