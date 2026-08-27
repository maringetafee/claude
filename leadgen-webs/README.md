# Leadgen Webs

Flujo para encontrar negocios locales sin web (o con web mejorable), generarles
una web de muestra personalizada, y preparar un borrador de propuesta por email.
**No envía nada automáticamente** — deja los borradores listos para que los revises
y los mandes tú (o los apruebes por lotes).

## 1. Configurar la API de Google Places (una vez)

1. Ve a https://console.cloud.google.com/ y crea un proyecto nuevo (o usa uno existente).
2. En "APIs y servicios" → "Biblioteca", busca **"Places API (New)"** y actívala.
3. En "APIs y servicios" → "Credenciales" → "Crear credenciales" → "Clave de API".
   Restríngela a "Places API (New)" para que no se pueda usar para otra cosa si se filtra.
4. Activa la facturación del proyecto (Google pide una tarjeta, pero da ~$200/mes de
   crédito gratis, que cubre miles de búsquedas — para el volumen de esto no deberías pagar nada,
   pero conviene poner una alerta de presupuesto en Google Cloud por si acaso).
5. Copia `.env.example` a `.env` y pega la clave en `GOOGLE_PLACES_API_KEY`.

## 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 3. Buscar leads en una ciudad

```bash
python scripts/find_leads.py --city "Getafe" --type restaurante --limit 40
```

Tipos disponibles: `bar`, `restaurante`, `peluqueria`. Genera un CSV en `leads/`
con nombre, dirección, teléfono, si tiene web o no, y una foto de portada si la
tienen en su ficha de Google.

## 4. Buscar emails (solo funciona para los que ya tienen web)

```bash
python scripts/find_emails.py leads/getafe_restaurante.csv
```

Los que no tienen web quedan marcados como `contactar_por_telefono=True` — para esos
no hay email que sacar automáticamente, la propuesta hay que mandarla por WhatsApp o llamada.

## 5. Generar las webs de muestra personalizadas

Las demos ya no se generan con las plantillas Jinja de `templates/` — se generan
reutilizando la arquitectura de `local-business-system` (Lolita/LÚMINA/Studio X),
así cada lead sale con el diseño premium real en vez del template genérico antiguo.

```bash
python scripts/sync_to_local_business_system.py
cd ../local-business-system
npm run build
```

Copia luego a `output/sites/` los ficheros generados para cada lead
(`<slug>.html`, más `_next/` e `img/` si han cambiado):

```bash
python -c "
import json, shutil
from pathlib import Path
leads = json.load(open('src/data/leads/leads.json', encoding='utf-8'))
out, dest = Path('out'), Path('../leadgen-webs/output/sites')
for lead in leads:
    src = out / f\"{lead['slug']}.html\"
    if src.exists():
        shutil.copy(src, dest / f\"{lead['slug']}.html\")
shutil.copytree(out / '_next', dest / '_next', dirs_exist_ok=True)
shutil.copytree(out / 'img', dest / 'img', dirs_exist_ok=True)
"
```

(`templates/*.html` se conservan solo como plantillas Jinja antiguas, ya sin
uso activo — `scripts/personalize.py` sigue existiendo por si hace falta
volver atrás, pero el flujo normal ahora es el de arriba.)

## 6. Publicar las webs de muestra en algún sitio público

Para que el link de la propuesta funcione en el email, `output/sites/` tiene que
estar colgado en algún sitio accesible por URL. La forma más rápida: arrastrar la
carpeta a https://app.netlify.com/drop (gratis, sin cuenta necesaria para probar).
Copia la URL resultante en `PREVIEW_BASE_URL` dentro de `.env`.

## 7. Generar los borradores de email

```bash
python scripts/generate_email_drafts.py leads/getafe_restaurante.csv
```

Genera `output/getafe_restaurante_borradores.csv` con asunto + cuerpo por lead y
el link a su web de muestra. **Revisa y edita el texto (nombre, teléfono) antes
de mandar nada** — esto solo prepara el contenido, no lo envía.

## 8. Regenerar el índice y desplegar

`python scripts/build_site.py` genera dos páginas en `output/sites/`, con
pestañas para moverse entre ellas:

- `index.html` — panel de propuestas: agrupa las webs de muestra por tipo de
  negocio y estado (pendiente/enviado/respondido/cliente/rechazado), y cada
  apartado enlaza arriba a la plantilla maestra correspondiente
  (`output/sites/plantillas/`, el export estático de `local-business-system`).
- `datos.html` — vista visual de todos los `leads/*.csv` (foto, dirección,
  contacto, si tiene web o no, valoración de Google y estado), en vez de
  tener que abrir el CSV en bruto. La genera `scripts/build_leads_data.py`
  (se llama automáticamente desde `build_site.py`, no hace falta ejecutarlo
  aparte).

```bash
python scripts/build_site.py
netlify deploy --prod --site 45d3343b-c03c-41aa-857b-886c62675825 --dir output/sites --functions netlify/functions
```

(`--functions` sube también `netlify/functions/estado.mjs`, la Netlify Function
que da soporte al checkbox de abajo — sin ese flag el checkbox dejaría de
funcionar aunque la web siguiera viéndose bien.)

**Marcar un lead como enviado directamente desde la web:** en `index.html`,
cada lead pendiente tiene un checkbox "Marcar enviado". Al marcarlo, guarda
el cambio en Netlify Blobs (vía `netlify/functions/estado.mjs`) — se ve al
momento desde cualquier dispositivo, sin rebuild ni redeploy, y también se
refleja en `datos.html`. Para pasar a `respondido`/`cliente`/`rechazado` (o
para corregir algo en bloque), sigue siendo más rápido editar la columna
`estado` en `output/<lote>_borradores.csv` y repetir los dos comandos de
arriba — eso reconstruye el HTML base; los cambios hechos por checkbox desde
entonces se vuelven a aplicar solos en cuanto la página carga y pide el
estado real a la función.

Si cambian las demos de `local-business-system`, hay que re-exportarlas y
volver a copiarlas:

```bash
cd ../local-business-system
STATIC_EXPORT_BASE_PATH=/plantillas npm run build
cp -r out/. ../leadgen-webs/output/sites/plantillas/
```

## Notas importantes

- **Los negocios sin web no tienen email localizable automáticamente.** Google
  Places no expone emails; solo se puede sacar rastreando la web propia del negocio,
  y si no tienen web no hay nada que rastrear. Para esos, la vía realista es WhatsApp
  o llamada usando el teléfono que sí da Google Places.
- **Envío de correos comerciales no solicitados en España**: la LSSICE restringe el
  email comercial sin consentimiento previo. Conviene mandar volúmenes moderados,
  bien personalizados (no plantilla genérica de spam masivo), y estar dispuesto a
  dejar de escribir a quien lo pida.
- Las webs generadas son **demos con contenido genérico** (no inventan platos,
  precios, horarios ni datos que no vengan de Google Places) — sirven para mostrar
  estilo y estructura, no como sitio final.
