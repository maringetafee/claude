// Genera public/images/getafe-map.svg a partir de un volcado de OpenStreetMap
// (Overpass API, `out geom`) con calles, vías de tren y parques de Getafe.
//
//   node scripts/build-getafe-map.mjs <volcado.json>
//
// Consulta usada (bbox 40.290,-3.755,40.340,-3.685):
//   way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|
//   unclassified|living_street|*_link)$"], way["railway"="rail"],
//   way["leisure"="park"]; out geom;
//
// El encuadre (VIEW, ORIGIN, UNITS_PER_DEG_LAT) debe coincidir con
// src/components/hero/GetafeMap.tsx, que coloca los centros encima.
import { readFileSync, writeFileSync } from "node:fs";

const VIEW = { width: 400, height: 500 };
const ORIGIN = { lat: 40.31555, lng: -3.71575 };
const UNITS_PER_DEG_LAT = 14137;
const UNITS_PER_DEG_LNG = UNITS_PER_DEG_LAT * Math.cos((ORIGIN.lat * Math.PI) / 180);
const MARGIN = 10;
const TOLERANCE = 0.35;

const ROAD_CLASS = {
  motorway: "motorway",
  motorway_link: "motorway",
  trunk: "motorway",
  trunk_link: "motorway",
  primary: "major",
  primary_link: "major",
  secondary: "major",
  secondary_link: "major",
  tertiary: "medium",
  tertiary_link: "medium",
  residential: "minor",
  unclassified: "minor",
  living_street: "minor",
};

const LAYERS = [
  ["minor", 'stroke="rgba(246,244,240,0.09)" stroke-width="0.6"'],
  ["medium", 'stroke="rgba(246,244,240,0.16)" stroke-width="1"'],
  ["major", 'stroke="rgba(246,244,240,0.24)" stroke-width="1.6"'],
  ["motorway", 'stroke="rgba(246,244,240,0.32)" stroke-width="2.4"'],
  ["rail", 'stroke="rgba(246,244,240,0.3)" stroke-width="1" stroke-dasharray="3 2"'],
];

const project = ({ lat, lon }) => [
  VIEW.width / 2 + (lon - ORIGIN.lng) * UNITS_PER_DEG_LNG,
  VIEW.height / 2 + (ORIGIN.lat - lat) * UNITS_PER_DEG_LAT,
];

const inside = ([x, y]) =>
  x >= -MARGIN && x <= VIEW.width + MARGIN && y >= -MARGIN && y <= VIEW.height + MARGIN;

// Douglas–Peucker. Los anillos cerrados se parten por el punto más lejano al
// inicio, porque con inicio == fin la distancia a la "recta" no está definida.
function simplify(points) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  if (ax === bx && ay === by) {
    let far = 1;
    for (let i = 1; i < points.length - 1; i++) {
      if (Math.hypot(points[i][0] - ax, points[i][1] - ay) > Math.hypot(points[far][0] - ax, points[far][1] - ay)) far = i;
    }
    return [...simplify(points.slice(0, far + 1)).slice(0, -1), ...simplify(points.slice(far))];
  }
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD <= TOLERANCE) return [points[0], points[points.length - 1]];
  return [...simplify(points.slice(0, idx + 1)).slice(0, -1), ...simplify(points.slice(idx))];
}

// Trozos de la línea que tocan el encuadre (se descarta lo que queda fuera).
function runsInView(points) {
  const runs = [];
  let run = [];
  points.forEach((p, i) => {
    const keep = inside(p) || (i > 0 && inside(points[i - 1])) || (i < points.length - 1 && inside(points[i + 1]));
    if (keep) run.push(p);
    else if (run.length) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1);
}

const fmt = (n) => Math.round(n * 10) / 10;
const toPath = (runs, close = false) =>
  runs.map((r) => "M" + r.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join("L") + (close ? "Z" : "")).join("");

const input = process.argv[2];
if (!input) {
  console.error("Uso: node scripts/build-getafe-map.mjs <volcado-overpass.json>");
  process.exit(1);
}

const { elements } = JSON.parse(readFileSync(input, "utf8"));
const lines = Object.fromEntries(LAYERS.map(([name]) => [name, []]));
const parks = [];

for (const el of elements) {
  if (el.type !== "way" || !el.geometry || !el.tags) continue;
  const { tags } = el;
  if (tags.tunnel && tags.tunnel !== "no") continue;
  const points = el.geometry.map(project);

  if (tags.leisure === "park") {
    if (points.some(inside)) parks.push(simplify(points));
    continue;
  }
  const layer = tags.railway === "rail" ? "rail" : ROAD_CLASS[tags.highway];
  if (!layer) continue;
  for (const run of runsInView(points)) lines[layer].push(simplify(run));
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}">` +
  `<!-- Datos: © OpenStreetMap contributors (ODbL) -->` +
  `<path d="${toPath(parks, true)}" fill="rgba(246,244,240,0.045)"/>` +
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  LAYERS.map(([name, style]) => `<path d="${toPath(lines[name])}" ${style}/>`).join("") +
  `</g></svg>\n`;

const out = new URL("../public/images/getafe-map.svg", import.meta.url);
writeFileSync(out, svg);
console.log(
  `getafe-map.svg: ${(svg.length / 1024).toFixed(0)} KB · parques ${parks.length} · ` +
    LAYERS.map(([name]) => `${name} ${lines[name].length}`).join(" · "),
);
