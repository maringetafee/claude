// Datos de ejemplo para probar la aplicación sin datos reales de la empresa.
import type { ParsedTable } from "../shared/excel.ts";
import type { Row } from "../shared/types.ts";

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

export function sampleTables(): ParsedTable[] {
  const r = rng(42);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const zonas = ["Norte", "Sur", "Este", "Oeste", "Centro"];
  const sectores = ["Hostelería", "Comercio", "Industria", "Servicios"];
  const clientes: Row[] = Array.from({ length: 40 }, (_, i) => [
    `C${String(i + 1).padStart(3, "0")}`,
    `Cliente ${i + 1} S.L.`,
    pick(zonas),
    pick(sectores),
  ]);
  const productos = [
    ["P01", "Toldo básico", "Toldos", 320],
    ["P02", "Toldo motorizado", "Toldos", 890],
    ["P03", "Pérgola", "Estructuras", 2400],
    ["P04", "Cortina enrollable", "Cortinas", 150],
    ["P05", "Mantenimiento anual", "Servicios", 120],
  ] as const;
  const comerciales = ["Ana", "Luis", "Marta", "Jorge"];

  const ventasMes = (mes: number, nombre: string): ParsedTable => {
    const rows: Row[] = [];
    for (let i = 0; i < 70 + Math.floor(r() * 30); i++) {
      const p = pick([...productos]);
      const uds = 1 + Math.floor(r() * 5);
      const dia = 1 + Math.floor(r() * 28);
      rows.push([
        `2026-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
        String(clientes[Math.floor(r() * clientes.length)][0]),
        p[1],
        p[2],
        uds,
        Math.round(uds * p[3] * (0.9 + r() * 0.2) * 100) / 100,
        pick(comerciales),
      ]);
    }
    return {
      fileName: `ventas_${nombre}_2026.xlsx`,
      sheetName: "Hoja1",
      suggestedName: "Ventas",
      columns: [
        { name: "Fecha", type: "date" },
        { name: "Código cliente", type: "text" },
        { name: "Producto", type: "text" },
        { name: "Familia", type: "text" },
        { name: "Unidades", type: "number" },
        { name: "Importe", type: "number" },
        { name: "Comercial", type: "text" },
      ],
      rows,
      warnings: [],
    };
  };

  const gastos: Row[] = [];
  for (let mes = 1; mes <= 6; mes++) {
    for (const cat of ["Personal", "Material", "Transporte", "Oficina", "Marketing"]) {
      gastos.push([`2026-${String(mes).padStart(2, "0")}-28`, cat, pick(zonas), Math.round((cat === "Personal" ? 18000 : 1500 + r() * 4000) * 100) / 100]);
    }
  }

  return [
    ventasMes(1, "enero"),
    ventasMes(2, "febrero"),
    ventasMes(3, "marzo"),
    {
      fileName: "clientes.xlsx",
      sheetName: "Hoja1",
      suggestedName: "Clientes",
      columns: [
        { name: "Código cliente", type: "text" },
        { name: "Nombre", type: "text" },
        { name: "Zona", type: "text" },
        { name: "Sector", type: "text" },
      ],
      rows: clientes,
      warnings: [],
    },
    {
      fileName: "gastos_2026.xlsx",
      sheetName: "Hoja1",
      suggestedName: "Gastos",
      columns: [
        { name: "Fecha", type: "date" },
        { name: "Categoría", type: "text" },
        { name: "Zona", type: "text" },
        { name: "Importe", type: "number" },
      ],
      rows: gastos,
      warnings: [],
    },
  ];
}
