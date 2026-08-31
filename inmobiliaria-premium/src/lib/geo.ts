const zoneCoordinates: Record<string, { lat: number; lng: number }> = {
  Getafe: { lat: 40.3057, lng: -3.7327 },
  Leganés: { lat: 40.3271, lng: -3.7635 },
  Alcorcón: { lat: 40.3459, lng: -3.828 },
  Carabanchel: { lat: 40.3838, lng: -3.7431 },
};

const DEFAULT_COORDS = { lat: 40.3057, lng: -3.7327 };

export function coordsForZone(zone: string) {
  return zoneCoordinates[zone] ?? DEFAULT_COORDS;
}

export function osmEmbedUrl(zone: string) {
  const { lat, lng } = coordsForZone(zone);
  const delta = 0.01;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}
