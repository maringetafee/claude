"""
Piezas de HTML/CSS compartidas entre build_site.py (panel de propuestas) y
build_leads_data.py (vista visual de los CSV de leads), para que las dos
paginas de output/sites/ se sientan como pestañas del mismo sitio.
"""
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

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


SHARED_CSS = """
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    font-family: ui-sans-serif, system-ui, sans-serif;
    margin: 0 auto;
    padding: 2rem 1.5rem 6rem;
    color: #17171a;
    background: #fafafa;
  }
  h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
  .resumen { color: #6b6b70; margin-bottom: 1.5rem; }
  .badge {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.2rem 0.6rem;
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
  nav.tabs {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e5e8;
  }
  nav.tabs a {
    text-decoration: none;
    color: #6b6b70;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.7rem 0.25rem;
    margin-right: 1.5rem;
    border-bottom: 2px solid transparent;
  }
  nav.tabs a.activa {
    color: #17171a;
    border-bottom-color: #17171a;
  }
  .check-hecho {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.76rem;
    color: #6b6b70;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  .check-hecho input {
    width: 15px;
    height: 15px;
    cursor: pointer;
    accent-color: #17171a;
  }
  .check-hecho input:disabled {
    cursor: wait;
    opacity: 0.5;
  }
"""


def nav_tabs(activa):
    def cls(tab):
        return "activa" if tab == activa else ""
    return f"""<nav class="tabs">
  <a class="{cls('panel')}" href="index.html">Panel de propuestas</a>
  <a class="{cls('datos')}" href="datos.html">Datos de leads (CSV)</a>
</nav>"""


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
