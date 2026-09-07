"""
Lanza scripts/find_leads.py para varias combinaciones de ciudad x tipo de
negocio de una sola vez, en vez de ir tipo por tipo a mano. Cada combinacion
genera su propio CSV en leads/<ciudad>_<tipo>.csv (find_leads ya separa por
tipo), asi que al terminar tienes los leads ya divididos por rubro.

Uso:
    python scripts/find_leads_batch.py --cities "Getafe,Leganes,Mostoles" --types "cafeteria,taller,dental" --limit 40

Si no pasas --types, usa una seleccion por defecto de rubros con plantilla o
con buen volumen de negocios sin web. Respeta una pausa corta entre llamadas
para no encadenar peticiones a la API de golpe.
"""
import argparse
import subprocess
import sys
import time
from pathlib import Path

from find_leads import TYPE_MAP

ROOT = Path(__file__).resolve().parent.parent

# Rubros por defecto: los que ya tienen plantilla de muestra + un par mas con
# mucho negocio local sin web. Ajusta la lista segun la zona.
TIPOS_POR_DEFECTO = [
    "restaurante", "bar", "cafeteria", "peluqueria", "unas",
    "floristeria", "dental", "taller",
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cities", required=True, help='Ciudades separadas por coma, ej: "Getafe,Leganes"')
    parser.add_argument("--types", default="", help='Tipos separados por coma. Vacio = seleccion por defecto.')
    parser.add_argument("--limit", type=int, default=40, help="Maximo de resultados por combinacion")
    parser.add_argument("--no-photos", action="store_true", help="No descargar fotos de portada")
    parser.add_argument("--pause", type=float, default=3.0, help="Segundos de pausa entre combinaciones")
    args = parser.parse_args()

    cities = [c.strip() for c in args.cities.split(",") if c.strip()]
    types = [t.strip() for t in args.types.split(",") if t.strip()] or TIPOS_POR_DEFECTO

    desconocidos = [t for t in types if t not in TYPE_MAP]
    if desconocidos:
        raise SystemExit(f"Tipos no reconocidos: {', '.join(desconocidos)}. Validos: {', '.join(TYPE_MAP)}")

    combos = [(c, t) for c in cities for t in types]
    print(f"{len(combos)} combinaciones ({len(cities)} ciudades x {len(types)} tipos)\n")

    fallos = []
    for i, (city, tipo) in enumerate(combos, 1):
        print(f"[{i}/{len(combos)}] {city} — {tipo}")
        cmd = [
            sys.executable, str(ROOT / "scripts" / "find_leads.py"),
            "--city", city, "--type", tipo, "--limit", str(args.limit),
        ]
        if args.no_photos:
            cmd.append("--no-photos")
        result = subprocess.run(cmd)
        if result.returncode != 0:
            fallos.append((city, tipo))
        if i < len(combos):
            time.sleep(args.pause)

    print()
    if fallos:
        print("Fallaron:", ", ".join(f"{c}/{t}" for c, t in fallos))
    else:
        print("Todas las combinaciones OK. CSVs en leads/.")


if __name__ == "__main__":
    main()
