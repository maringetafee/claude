// Tipos compartidos entre el navegador y las funciones de Netlify.

export type ColType = "number" | "date" | "text";
export interface Column {
  name: string;
  type: ColType;
}
export type Cell = string | number | null;
export type Row = Cell[];

/** Tabla en memoria: columnas + filas como arrays (mismo orden que columns). */
export interface TableData {
  id: string;
  name: string;
  area: string;
  columns: Column[];
  rows: Row[];
}

/** Columna que se añade a cada fila para saber de qué archivo viene. */
export const ORIGIN_COL = "Archivo";

export interface DatasetMeta {
  id: string; // "ds_..."
  name: string;
  area: string;
  columns: Column[];
  rowCount: number;
  chunkCount: number;
  files: string[];
  /** Cabeceras normalizadas (sin Archivo) para reconocer Excel con la misma estructura. */
  signature: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  fromDataset: string; // lado "muchos" (p. ej. Ventas)
  fromColumn: string;
  toDataset: string; // lado "uno" / tabla de consulta (p. ej. Clientes)
  toColumn: string;
  auto: boolean;
  enabled: boolean;
}

export type Agg = "sum" | "avg" | "count" | "countDistinct" | "min" | "max";
export type Grain = "day" | "month" | "quarter" | "year";

export type FilterOp = "eq" | "neq" | "in" | "gt" | "gte" | "lt" | "lte" | "contains";
export interface Filter {
  column: string;
  op: FilterOp;
  value: string;
}

export interface Measure {
  column: string | null; // null = contar filas
  agg: Agg;
  name: string;
}

/** Tabla derivada: se recalcula sola a partir de su origen cada vez que cambian los datos. */
export interface DerivedTable {
  id: string; // "dt_..."
  name: string;
  area: string;
  source: string; // id de tabla (ds_ o dt_)
  filters: Filter[];
  groupBy: { column: string; grain?: Grain }[];
  measures: Measure[];
  updatedAt: string;
}

export type NumberFormat = "number" | "currency" | "percent";

export interface KpiSpec {
  id: string;
  label: string;
  column: string | null;
  agg: Agg;
  format: NumberFormat;
}

export type ChartType = "bar" | "hbar" | "line" | "pie" | "table";
export interface ChartSpec {
  id: string;
  type: ChartType;
  title: string;
  dimension: string;
  grain?: Grain;
  measure: { column: string | null; agg: Agg };
  format: NumberFormat;
  topN: number;
}

export interface ReportSpec {
  targetId: string;
  title: string;
  description: string;
  kpis: KpiSpec[];
  charts: ChartSpec[];
  slicers: string[];
  tableColumns: string[] | null; // null = todas
  auto: boolean;
  updatedAt: string;
}

export interface MasterItem {
  targetId: string;
  kpiIds: string[] | null; // null = los 2 primeros
  chartId: string | null | "none"; // null = el primero
}
export interface MasterSpec {
  title: string;
  subtitle: string;
  items: MasterItem[] | null; // null = automático (todos los informes visibles)
}

export type Role = "admin" | "editor" | "viewer";
export interface RowFilter {
  column: string;
  values: string[];
}
export interface UserPublic {
  id: string;
  email: string;
  name: string;
  role: Role;
  areas: string[]; // ["*"] = todas
  rowFilters: RowFilter[];
}

export interface Source {
  id: string;
  name: string;
  url: string;
  datasetId: string | null; // null = automático (por estructura) o nueva tabla
  area: string;
  everyHours: number;
  lastRun: string | null;
  lastStatus: "ok" | "error" | null;
  lastMessage: string;
}

export interface Activity {
  at: string;
  who: string;
  what: string;
}

export interface Bootstrap {
  needsSetup?: boolean;
  user: UserPublic | null;
  datasets: DatasetMeta[];
  relationships: Relationship[];
  derived: DerivedTable[];
  reports: Record<string, ReportSpec>;
  master: MasterSpec;
  areas: string[];
  sources: Source[];
  activity: Activity[];
  hasApiKey: boolean;
}
