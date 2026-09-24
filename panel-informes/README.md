# Panel de informes

Aplicación web que sustituye a Power BI Pro + SharePoint para informes a partir de Excel:
usuarios con roles, carga de Excel, tablas que se juntan y relacionan solas, informe maestro
que enlaza con informes específicos y cargas automáticas.

- Producción: https://panel-informes-8dc459.netlify.app (sitio Netlify `panel-informes-8dc459`)
- Stack: Vite + React + Tailwind v4 (frontend), Netlify Functions + Netlify Blobs (backend), SheetJS (Excel)

## Cómo funciona

1. **Subir Excel** (Datos y cargas): se detecta la fila de cabecera, los tipos (número, fecha, texto; formato español),
   se quitan filas de «Total». Archivos con la misma estructura (ventas de cada mes) van a la misma tabla.
   Cada fila guarda su `Archivo`: volver a subir un archivo corregido **sustituye** sus filas, no duplica.
2. **Relaciones**: si dos tablas comparten una columna y en una los valores no se repiten (p. ej. `Código cliente`),
   se crea la relación sola. El informe de Ventas puede usar entonces `Clientes › Zona`.
3. **Tablas derivadas**: filtros + agrupar (por mes, zona…) + cálculos. Se recalculan solas con cada carga.
4. **Informes**: cada tabla tiene un informe automático (KPIs, evolución, reparto, detalle, filtros) que se puede personalizar.
5. **Informe maestro**: una tarjeta por informe con sus KPIs y un gráfico; filtros comunes a todas las tablas.
   Clic en tarjeta o barra → informe específico ya filtrado (los filtros viajan en la URL).
6. **Roles**: Administración / Edición / Lectura, por **áreas**, y opcionalmente **solo ciertas filas**
   (p. ej. `Zona = Sur`). Las filas se filtran en el servidor, también a través de relaciones.
7. **Automatización**:
   - *Cargas automáticas*: enlace de OneDrive/SharePoint («cualquier persona con el vínculo»), se relee cada X horas
     (función programada `sync-sources`, cada hora).
   - *API*: `POST /api/ingest?area=X[&dataset=ID]` con `X-Api-Key`, `X-File-Name` y
     `Content-Type: application/octet-stream`; el cuerpo es el archivo. Pensado para Power Automate (acción HTTP, premium).

## Desarrollo

```bash
npm install
npm run dev        # netlify dev --offline en http://localhost:8888 (necesita .env con SESSION_SECRET y SETUP_TOKEN)
npm test           # pruebas del motor (lectura de Excel, uniones, relaciones, derivadas)
npm run build
```

Despliegue: `npx netlify deploy --prod --dir dist` (el sitio ya está enlazado en `.netlify/`).
Variables en Netlify: `SESSION_SECRET` (secreta) y `SETUP_TOKEN` (solo sirve mientras no hay usuarios).

## Almacenamiento (Netlify Blobs, store `informes`)

- `meta/*`: usuarios (contraseñas con scrypt), tablas, relaciones, derivadas, informes, maestro, fuentes, actividad
- `data/<id>/<n>`: filas en trozos de 5000
- `staging/<id>/*`: subidas en curso (el navegador sube en trozos de ~2,5 MB por el límite de 6 MB de Netlify)

## Límites conocidos

- Pensado para volúmenes de Excel (hasta cientos de miles de filas en total): los cálculos se hacen en el navegador.
- La carga final de una subida reescribe la tabla completa en una función (límite de tiempo de Netlify).
- Los enlaces de OneDrive/SharePoint tienen que permitir acceso sin iniciar sesión; si la empresa lo bloquea, usar la API o la subida manual.
