"""
Piezas de HTML/CSS compartidas entre build_site.py (panel de propuestas) y
build_leads_data.py (vista visual de los CSV de leads), para que las dos
paginas de output/sites/ se sientan como pestañas del mismo sitio.
"""
import csv
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

ESTADO_LABELS = {
    "pendiente": "Pendiente",
    "enviado": "Enviado",
    "respondido": "Respondido",
    "cliente": "Cliente",
    "rechazado": "Rechazado",
}
ESTADO_ORDEN = ["pendiente", "enviado", "respondido", "cliente", "rechazado"]


def badge_class(estado):
    return f"badge badge-{estado}" if estado in ESTADO_LABELS else "badge badge-otro"


def badge_html(slug, estado):
    """Badge envuelto en un contenedor con data-slug, para que el script de
    sincronizacion (estado.mjs) pueda localizarlo y actualizarlo en vivo."""
    return (
        f'<span class="badge-wrap" data-slug="{slug}">'
        f'<span class="{badge_class(estado)}">{ESTADO_LABELS.get(estado, estado)}</span>'
        f"</span>"
    )


def checkbox_hecho(slug, estado):
    """Checkbox 'marcar como hecho' — solo se pinta para leads pendientes.
    Al marcarlo, un script en el cliente llama a la Netlify Function
    estado.mjs para pasar el lead a 'enviado' (persistido en Netlify Blobs,
    visible desde cualquier dispositivo). Al desmarcarlo, vuelve a pendiente."""
    if estado != "pendiente":
        return ""
    return (
        f'<label class="check-hecho">'
        f'<input type="checkbox" data-slug="{slug}" data-target-estado="enviado" />'
        f"Marcar enviado</label>"
    )


def cargar_estados():
    """Devuelve {slug: estado}, leyendo todos los output/*_borradores.csv."""
    estados = {}
    for csv_path in sorted(ROOT.glob("output/*_borradores.csv")):
        with csv_path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                slug = row.get("slug")
                if slug:
                    estados[slug] = row.get("estado", "pendiente") or "pendiente"
    return estados


# Metadatos visuales por tipo de negocio (icono + color de acento), en el
# orden en que deben aparecer las secciones. La clave coincide exactamente
# con la columna type_label de los leads/*.csv (ver scripts/find_leads.py).
TIPO_META = {
    "Restaurante":   {"icon": "🍽️", "color": "#a9812f"},
    "Bar":           {"icon": "🍸", "color": "#b3541e"},
    "Cafeteria":     {"icon": "☕", "color": "#6b4a2f"},
    "Peluqueria":    {"icon": "💇", "color": "#a13d63"},
    "Unas":          {"icon": "💅", "color": "#cf5b8a"},
    "Dental":        {"icon": "🦷", "color": "#14a8ac"},
    "Estetica":      {"icon": "✨", "color": "#b3538e"},
    "Fisioterapia":  {"icon": "🩹", "color": "#3f7dbf"},
    "Floristeria":   {"icon": "💐", "color": "#c2185b"},
    "Taller":        {"icon": "🔧", "color": "#55606b"},
    "Abogado":       {"icon": "⚖️", "color": "#8a6d1a"},
    "Inmobiliaria":  {"icon": "🏠", "color": "#b3134f"},
    "Panaderia":     {"icon": "🥐", "color": "#a3722c"},
    "Autoescuela":   {"icon": "🚗", "color": "#3a5a8a"},
    "Veterinario":   {"icon": "🐾", "color": "#5c7a3f"},
}
TIPO_ORDEN = list(TIPO_META.keys())


def tipo_icon(tipo):
    return TIPO_META.get(tipo, {}).get("icon", "🏷️")


def tipo_color(tipo):
    return TIPO_META.get(tipo, {}).get("color", "#6b6b70")


def orden_tipo(tipo):
    return TIPO_ORDEN.index(tipo) if tipo in TIPO_ORDEN else len(TIPO_ORDEN)


# Plantillas maestras publicadas en output/sites/plantillas/ (una demo
# generica por tipo de negocio, la que se personaliza por lead). Si un tipo
# no tiene ninguna todavia, simplemente no se muestra el enlace.
PLANTILLAS_MAESTRAS = {
    "Restaurante": [("Plantilla Restaurante — sala elegante, reserva de mesa", "plantillas/restaurante/index.html")],
    "Bar": [("Plantilla Bar — bar de barrio, reserva de mesa", "plantillas/bar/index.html")],
    "Cafeteria": [("Plantilla Cafetería — café de especialidad, tema cálido", "plantillas/cafeteria/index.html")],
    "Peluqueria": [
        ("Plantilla Peluquería Mujer — salón, tema editorial", "plantillas/peluqueria-mujer/index.html"),
        ("Plantilla Peluquería Hombre — barbería, tema steel-blue", "plantillas/peluqueria-hombre/index.html"),
    ],
    "Unas": [("Plantilla Uñas — salón de manicura, pedir cita", "plantillas/unas/index.html")],
    "Dental": [("Plantilla Clínica dental — tema teal calmado, pedir cita", "plantillas/clinica-dental/index.html")],
    "Floristeria": [("Plantilla Floristería — tienda de flores, animada", "plantillas/floristeria/index.html")],
    "Taller": [("Plantilla Taller mecánico — multimarca, tema industrial", "plantillas/taller-mecanico/index.html")],
    "Abogado": [("Plantilla Abogado — despacho, solicitar consulta", "plantillas/abogado/index.html")],
    "Inmobiliaria": [("Plantilla Inmobiliaria — copia literal de Inmo Retail, con mapa", "plantillas/inmobiliaria/index.html")],
    "Panaderia": [("Plantilla Panadería — obrador artesano, hacer un encargo", "plantillas/panaderia/index.html")],
    "Autoescuela": [("Plantilla Autoescuela — reservar clase", "plantillas/autoescuela/index.html")],
    "Veterinario": [("Plantilla Veterinario — clínica, pedir cita", "plantillas/veterinario/index.html")],
    # Estetica y Fisioterapia: leads ya descargados, todavia sin plantilla propia.
}


SHARED_CSS = """
  :root {
    color-scheme: light;
    --paper: #faf8f4;
    --surface: #ffffff;
    --ink: #1c1a17;
    --ink-soft: #6b6560;
    --line: #eae5da;
    --line-soft: #f1ede4;
    --accent: #b3134f;
  }
  * { box-sizing: border-box; }
  body {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
    margin: 0 auto;
    max-width: 1180px;
    padding: 2.25rem 1.5rem 6rem;
    color: var(--ink);
    background: var(--paper);
    line-height: 1.5;
  }
  h1 {
    font-family: "Fraunces", serif;
    font-weight: 500;
    font-size: clamp(1.9rem, 4vw, 2.4rem);
    margin: 0 0 .3rem;
    letter-spacing: -.01em;
  }
  .resumen { color: var(--ink-soft); margin-bottom: 1.75rem; font-size: .95rem; }

  /* ---- Nav tabs ---- */
  nav.tabs {
    display: flex;
    gap: .4rem;
    margin-bottom: 1.75rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: .3rem;
    width: fit-content;
  }
  nav.tabs a {
    text-decoration: none;
    color: var(--ink-soft);
    font-size: .84rem;
    font-weight: 500;
    padding: .5rem 1.1rem;
    border-radius: 999px;
    transition: background .2s, color .2s;
  }
  nav.tabs a:hover { color: var(--ink); }
  nav.tabs a.activa { color: #fff; background: var(--ink); }

  /* ---- Stat cards ---- */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: .75rem;
    margin-bottom: 2rem;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 1rem 1.1rem;
  }
  .stat-card strong {
    display: block;
    font-family: "Fraunces", serif;
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 1;
  }
  .stat-card span {
    display: block;
    margin-top: .3rem;
    font-size: .74rem;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--ink-soft);
  }

  /* ---- Jump nav (pills per tipo) ---- */
  .jump-nav {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-bottom: 2.5rem;
  }
  .jump-nav a {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    text-decoration: none;
    font-size: .82rem;
    font-weight: 500;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: .4rem .85rem .4rem .6rem;
    transition: border-color .2s, transform .2s;
  }
  .jump-nav a:hover { border-color: var(--tipo-color, var(--accent)); transform: translateY(-1px); }
  .jump-nav .conteo { color: var(--ink-soft); font-weight: 400; }

  /* ---- Tipo section ---- */
  section.tipo, section.grupo {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 1.85rem 1.85rem 1.5rem;
    margin-bottom: 1.75rem;
    scroll-margin-top: 1.5rem;
    border-top: 3px solid var(--tipo-color, var(--line));
  }
  section.tipo h2, section.grupo h2 {
    font-family: "Fraunces", serif;
    font-weight: 500;
    font-size: 1.3rem;
    margin: 0 0 1.1rem;
    display: flex;
    align-items: baseline;
    gap: .55rem;
    flex-wrap: wrap;
  }
  .tipo-icon { font-size: 1.15em; }
  .conteo { font-weight: 400; color: var(--ink-soft); font-size: .82rem; }
  .ciudad-chips {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem;
    margin: -.4rem 0 1.2rem;
  }
  .ciudad-chips span {
    font-size: .74rem;
    color: var(--ink-soft);
    background: var(--line-soft);
    border-radius: 999px;
    padding: .2rem .65rem;
  }

  a.maestra {
    display: flex;
    align-items: center;
    gap: .75rem;
    flex-wrap: wrap;
    text-decoration: none;
    color: #fff;
    background: var(--tipo-color, var(--ink));
    border-radius: 10px;
    padding: .9rem 1.1rem;
    margin-bottom: 1.35rem;
    transition: filter .2s;
  }
  a.maestra:hover { filter: brightness(1.12); }
  .maestra-tag {
    font-size: .68rem;
    text-transform: uppercase;
    letter-spacing: .08em;
    background: rgba(255,255,255,.22);
    padding: .2rem .5rem;
    border-radius: 999px;
    flex-shrink: 0;
  }
  .maestra-nombre { font-weight: 500; flex: 1; min-width: 160px; }
  .maestra-flecha { font-size: .85rem; opacity: .85; white-space: nowrap; }

  /* ---- Badges ---- */
  .badge {
    font-size: .68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .03em;
    padding: .22rem .6rem;
    border-radius: 999px;
    white-space: nowrap;
  }
  .badge-pendiente { background: #f2eddc; color: #8a6d1a; }
  .badge-enviado { background: #dce8fc; color: #1a4fd6; }
  .badge-respondido { background: #e8dcfc; color: #6b1ad6; }
  .badge-cliente { background: #d9f2e1; color: #157a3d; }
  .badge-rechazado { background: #fcdcdc; color: #b31a1a; }
  .badge-otro { background: #ececec; color: #666; }
  .badge-sinweb { background: #fde3d0; color: #a34d0a; }

  .check-hecho {
    display: flex;
    align-items: center;
    gap: .35rem;
    font-size: .74rem;
    color: var(--ink-soft);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  .check-hecho input {
    width: 15px;
    height: 15px;
    cursor: pointer;
    accent-color: var(--ink);
  }
  .check-hecho input:disabled { cursor: wait; opacity: .5; }

  @media (max-width: 640px) {
    section.tipo, section.grupo { padding: 1.4rem 1.15rem 1.15rem; }
  }
"""


def page_head_extra():
    """Preconnect + import de las fuentes que usa SHARED_CSS."""
    return (
        '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">'
    )


def nav_tabs(activa):
    def cls(tab):
        return "activa" if tab == activa else ""
    return f"""<nav class="tabs">
  <a class="{cls('panel')}" href="index.html">Panel de propuestas</a>
  <a class="{cls('datos')}" href="datos.html">Datos de leads (CSV)</a>
</nav>"""


def jump_nav(counts_por_tipo):
    """counts_por_tipo: {tipo: n}. Genera la fila de pills para saltar a cada
    sección de tipo, en el orden fijo de TIPO_ORDEN."""
    tipos = sorted(counts_por_tipo.keys(), key=orden_tipo)
    pills = "\n".join(
        f'  <a href="#tipo-{tipo.lower()}" style="--tipo-color:{tipo_color(tipo)}">'
        f'<span class="tipo-icon">{tipo_icon(tipo)}</span>{tipo} '
        f'<span class="conteo">({counts_por_tipo[tipo]})</span></a>'
        for tipo in tipos
    )
    return f'<nav class="jump-nav">\n{pills}\n</nav>'


def stat_card(valor, etiqueta):
    return f'<div class="stat-card"><strong>{valor}</strong><span>{etiqueta}</span></div>'


# Script compartido por index.html y datos.html: al cargar, pide a la Netlify
# Function estado.mjs el estado real (Netlify Blobs) de cada lead y actualiza
# los badges en pantalla; ademas conecta los checkboxes "Marcar enviado" para
# que persistan el cambio sin depender de rehacer el build.
ESTADO_SYNC_SCRIPT = """
<script>
(function () {
  var FN_URL = "/.netlify/functions/estado";
  var LABELS = { pendiente: "Pendiente", enviado: "Enviado", respondido: "Respondido", cliente: "Cliente", rechazado: "Rechazado" };
  var VALIDOS = Object.keys(LABELS);

  function badgeClass(estado) {
    return "badge badge-" + (VALIDOS.indexOf(estado) !== -1 ? estado : "otro");
  }

  function aplicar(slug, estado) {
    document.querySelectorAll('.badge-wrap[data-slug="' + CSS.escape(slug) + '"] .badge').forEach(function (span) {
      span.className = badgeClass(estado);
      span.textContent = LABELS[estado] || estado;
    });
    var cb = document.querySelector('input[type=checkbox][data-slug="' + CSS.escape(slug) + '"]');
    if (cb) cb.checked = estado !== "pendiente";
  }

  fetch(FN_URL)
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (data) {
      Object.keys(data).forEach(function (slug) { aplicar(slug, data[slug].estado); });
    })
    .catch(function () {});

  document.querySelectorAll("input[type=checkbox][data-slug]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      var slug = cb.getAttribute("data-slug");
      var destino = cb.checked ? cb.getAttribute("data-target-estado") : "pendiente";
      cb.disabled = true;
      fetch(FN_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: slug, estado: destino }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("fallo al guardar");
          aplicar(slug, destino);
        })
        .catch(function () {
          cb.checked = !cb.checked;
          alert("No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.");
        })
        .finally(function () { cb.disabled = false; });
    });
  });
})();
</script>
"""
