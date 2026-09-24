"""
Lanza el agente Responder (desplegado en Netlify) desde la terminal, para
cuando Claude revisa los chats de WhatsApp Web de Mario (Claude in Chrome):
lee la conversación, la guarda en un .txt y la analiza con esto. El
resultado queda en el pipeline del panel igual que si se hiciera desde
responder.html.

Uso:
    # analizar (imprime la respuesta propuesta y la estrategia)
    python scripts/responder_cli.py analizar <slug> <conversacion.txt> [--canal whatsapp] [--nota "..."]

    # registrar que ha dicho que sí / se ha perdido (genera la lección)
    python scripts/responder_cli.py registrar <slug> <fase> [--motivo "..."] [--nota "..."]

    # buscar el slug de un negocio por nombre
    python scripts/responder_cli.py buscar "nombre del negocio"

La ficha del lead se saca de output/sites/responder-leads.json (se genera
con build_responder.py). Si el slug no está ahí, se usa como negocio manual.
"""
import argparse
import base64
import json
import sys
import time
import unicodedata
import urllib.request
import uuid
from pathlib import Path

BASE = "https://demos-pruebas.netlify.app/.netlify/functions/responder"
AUTH = "Basic " + base64.b64encode(b"make:web").decode()
LEADS = Path(__file__).resolve().parent.parent / "output" / "sites" / "responder-leads.json"
FASES = ["primer_contacto", "interesado", "negociando", "cerrado_entrada", "cliente_activo", "upsell", "perdido"]

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def peticion(url, body=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    req.add_header("Authorization", AUTH)
    if data:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as r:
        texto = r.read().decode("utf-8")
        return r.status, (json.loads(texto) if texto.strip() else None)


def norm(s):
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")


def cargar_leads():
    return json.loads(LEADS.read_text(encoding="utf-8")) if LEADS.exists() else []


def ficha_lead(slug):
    for l in cargar_leads():
        if l["slug"] == slug:
            return {k: v for k, v in l.items() if k != "slug"}
    return {"nombre": slug, "origen": "añadido desde la terminal"}


def cmd_buscar(args):
    q = norm(args.nombre).split()
    for l in cargar_leads():
        texto = norm(f"{l.get('nombre', '')} {l.get('tipo', '')} {l.get('ciudad', '')}")
        if all(p in texto for p in q):
            print(f"{l['slug']}\t{l.get('nombre')}\t{l.get('tipo', '')}\t{l.get('ciudad', '')}\t{l.get('telefono', '')}")


def cmd_analizar(args):
    conversacion = Path(args.conversacion).read_text(encoding="utf-8")
    job = str(uuid.uuid4())
    status, _ = peticion(BASE + "-background", {
        "jobId": job, "slug": args.slug, "lead": ficha_lead(args.slug),
        "canal": args.canal, "conversacion": conversacion, "nota": args.nota or "",
    })
    if status not in (200, 202):
        sys.exit(f"Error al lanzar el análisis: HTTP {status}")
    inicio = time.time()
    while time.time() - inicio < 360:
        time.sleep(4)
        _, d = peticion(f"{BASE}?job={job}")
        if d and d.get("estado") == "listo":
            r = d["resultado"]
            e = r["estrategia"]
            print(f"FASE: {r['fase']}\n")
            print(f"RESPUESTA:\n{r['respuesta']['texto']}\n")
            print(f"ALTERNATIVA:\n{r['respuesta']['alternativa_corta']}\n")
            print(f"OFRECER AHORA: {e['ofrecer_ahora']['servicio_id']} · {e['ofrecer_ahora']['precio']} — {e['ofrecer_ahora']['por_que']}")
            for g in e["guardar_para_despues"]:
                print(f"DESPUÉS: {g['servicio_id']} · {g['precio']} — {g['cuando_sacarlo']}")
            print(f"SI PIDE REBAJA: {e['margen_negociacion']}")
            print(f"SIGUIENTE PASO: {r['siguiente_paso']['accion']} ({r['siguiente_paso']['cuando']})")
            for a in r["alertas"]:
                print(f"OJO: {a}")
            return
        if d and d.get("estado") == "error":
            sys.exit(f"Error en el análisis: {d.get('error')}")
    sys.exit("El análisis ha tardado demasiado.")


def cmd_registrar(args):
    if args.fase not in FASES:
        sys.exit(f"Fase inválida. Opciones: {', '.join(FASES)}")
    lead = ficha_lead(args.slug)
    _, d = peticion(BASE, {
        "accion": "guardar", "slug": args.slug, "nombre": lead.get("nombre"), "tipo": lead.get("tipo"),
        "fase": args.fase, "motivo": args.motivo or "", "nota": args.nota or "",
    })
    print("Guardado.")
    if d and d.get("leccion"):
        print(f"Lección: {d['leccion'].get('leccion')}")


def main():
    ap = argparse.ArgumentParser(description="Agente Responder desde la terminal")
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("buscar")
    b.add_argument("nombre")
    b.set_defaults(fn=cmd_buscar)
    a = sub.add_parser("analizar")
    a.add_argument("slug")
    a.add_argument("conversacion", help="ruta a un .txt con la conversación")
    a.add_argument("--canal", default="whatsapp", choices=["whatsapp", "instagram", "email", "llamada"])
    a.add_argument("--nota")
    a.set_defaults(fn=cmd_analizar)
    r = sub.add_parser("registrar")
    r.add_argument("slug")
    r.add_argument("fase")
    r.add_argument("--motivo")
    r.add_argument("--nota")
    r.set_defaults(fn=cmd_registrar)
    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
