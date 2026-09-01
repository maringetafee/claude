# Social Automation — Instagram + Facebook

Publica automaticamente en Instagram y Facebook usando material que subas a
`content/queue/`. La caption la escribe Claude; no se genera imagen con IA,
se usa el material real que subas (fotos/videos de las webs que hace la
agencia, capturas, reels, etc.).

## Como funciona

1. Subes fotos (`.jpg`, `.png`) o videos (`.mp4`, `.mov`) a `content/queue/`.
   Opcionalmente añade un archivo `.txt` con el mismo nombre para dar
   contexto extra a la caption (ej: `web-lolita.jpg` + `web-lolita.txt` con
   "web de restaurante que acabamos de entregar").
2. El workflow de GitHub Actions (`.github/workflows/social-post-webdev.yml`)
   corre lunes/miercoles/viernes a las 15:00 UTC (o manualmente desde la
   pestaña Actions > "Run workflow").
3. Coge el siguiente archivo en cola (orden alfabetico), genera la caption
   con la API de Claude, y publica en Instagram y Facebook via la Graph API
   de Meta.
4. Si todo va bien, mueve el archivo a `content/posted/` y registra el post
   en `content/posted.json`. Si falla, el archivo se queda en la cola para
   reintentarlo en la siguiente ejecucion.

## Configuracion necesaria (una sola vez)

### 1. Secrets del repo

En GitHub: `Settings > Secrets and variables > Actions > New repository secret`.
Añade estos 4:

| Secret | De donde sale |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys |
| `IG_USER_ID` | ID de tu cuenta de Instagram Business (Graph API Explorer: `GET /me/accounts` -> pagina -> `GET /{page-id}?fields=instagram_business_account`) |
| `FB_PAGE_ID` | ID de la Facebook Page vinculada a esa cuenta de Instagram |
| `FB_PAGE_ACCESS_TOKEN` | Token de pagina de larga duracion (60 dias) con permisos `instagram_content_publish`, `pages_manage_posts`, `pages_read_engagement`, `pages_show_list` |

**Importante:** el `FB_PAGE_ACCESS_TOKEN` de larga duracion caduca cada ~60
dias. Toca renovarlo a mano en
[Graph API Explorer](https://developers.facebook.com/tools/explorer/) y
actualizar el secret. No hay renovacion automatica implementada.

### 2. Variable opcional

En `Settings > Secrets and variables > Actions > Variables`, puedes añadir
`BUSINESS_NICHE` para cambiar la descripcion del negocio que usa Claude al
escribir las captions (por defecto ya describe una agencia de paginas web).

### 3. Repo publico

El repo tiene que seguir siendo publico (o el archivo tiene que ser
accesible por URL) porque la Graph API descarga la imagen/video desde
`raw.githubusercontent.com`. Si el repo se vuelve privado, esto deja de
funcionar.

## Probar en local sin publicar de verdad

```bash
cd social-automation
DRY_RUN=true GITHUB_REPOSITORY=maringetafee/claude python scripts/run.py
```

Con `DRY_RUN=true` se genera la caption (si tienes `ANTHROPIC_API_KEY` en tu
entorno) pero no se llama a la Graph API ni se mueve ningun archivo.

## Probar manualmente en GitHub

Pestaña **Actions** > "Publicar en Instagram y Facebook (agencia web)" >
**Run workflow**. Puedes marcar la opcion `dry_run` para simular sin
publicar.

## Limitaciones conocidas

- Videos en Instagram se publican como Reels (`media_type=REELS`); el
  workflow espera hasta 5 minutos a que Meta termine de procesarlo.
- No hay generacion de imagenes por IA: si `content/queue/` esta vacio, el
  workflow no falla, simplemente no publica nada ese dia. Hay que ir
  subiendo material.
- No hay reintentos automaticos de token expirado: si el token caduca, el
  job fallara y GitHub te avisara por email/notificacion.
