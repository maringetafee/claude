/**
 * Datos oficiales de la DGT (microdatos públicos de exámenes por
 * autoescuela/sección), consultados a través de agregadores que citan la
 * fuente oficial. Periodo más reciente y con muestra más amplia disponible
 * en el momento de escribir esto. Antes de publicar: TODO confirmar si hay
 * un periodo más reciente publicado y actualizar.
 *
 * No se manipulan ni redondean al alza los porcentajes. No se afirma
 * superioridad frente a otras autoescuelas: el dato de la media del centro
 * de examen se muestra tal cual, incluso siendo Rosangel ligeramente
 * inferior en el periodo analizado.
 */
export const dgtStats = {
  schoolCode: "M-1711",
  examCenter: "Móstoles",
  period: "Febrero – julio 2026",
  source: "Microdatos oficiales de la DGT (portal de transparencia)",
  sourceUpdatedAt: "17 de agosto de 2026",
  practical: {
    passed: 59,
    total: 149,
    passRate: 39.6,
    centerAveragePassRate: 43.66,
  },
  theory: {
    passed: 68,
    total: 168,
    passRate: 40.48,
  },
  firstAttemptShareAmongPassed: 35.6,
  monthlyAverageExams: 24.8,
  note: "Los datos son de solo 6 meses y una muestra relativamente pequeña, por lo que pueden variar de un mes a otro según el grupo de alumnos que se presenta.",
};
