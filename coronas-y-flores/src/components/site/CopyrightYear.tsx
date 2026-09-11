"use client";

import { useSyncExternalStore } from "react";

// Año calculado en el navegador, como el `#year` de la plantilla (la página
// está cacheada, así que el año del servidor podría quedarse viejo).
export function CopyrightYear() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year ?? ""}</>;
}
