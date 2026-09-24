import { useMemo, useState } from "react";
import type { TableData } from "../../shared/types.ts";
import { tableToXlsx } from "../../shared/excel.ts";
import { fmtCell } from "../format.ts";

export function downloadXlsx(t: TableData, columns?: string[]) {
  const idx = columns ? columns.map((c) => t.columns.findIndex((x) => x.name === c)).filter((i) => i > -1) : t.columns.map((_, i) => i);
  const bytes = tableToXlsx(t.name, idx.map((i) => t.columns[i]), t.rows.map((r) => idx.map((i) => r[i])));
  const blob = new Blob([bytes as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${t.name.replace(/[\\/:*?"<>|]/g, "_")}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function DataTable({ table, columns, pageSize = 25 }: { table: TableData; columns?: string[] | null; pageSize?: number }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ i: number; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);
  const idx = useMemo(
    () => (columns ? columns.map((c) => table.columns.findIndex((x) => x.name === c)).filter((i) => i > -1) : table.columns.map((_, i) => i)),
    [table, columns],
  );
  const rows = useMemo(() => {
    let r = table.rows;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      r = r.filter((row) => idx.some((i) => row[i] !== null && String(row[i]).toLowerCase().includes(s)));
    }
    if (sort) {
      const { i, dir } = sort;
      r = [...r].sort((a, b) => {
        const x = a[i];
        const y = b[i];
        if (x === y) return 0;
        if (x === null) return 1;
        if (y === null) return -1;
        return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "es", { numeric: true })) * dir;
      });
    }
    return r;
  }, [table, q, sort, idx]);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const p = Math.min(page, pages - 1);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input className="input max-w-xs" placeholder="Buscar en la tabla…" value={q} onChange={(e) => (setQ(e.target.value), setPage(0))} />
        <span className="text-xs text-slate-500">{rows.length.toLocaleString("es-ES")} filas</span>
        <button className="btn btn-ghost ml-auto" onClick={() => downloadXlsx({ ...table, rows }, idx.map((i) => table.columns[i].name))}>
          Descargar Excel
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full">
          <thead>
            <tr>
              {idx.map((i) => (
                <th
                  key={i}
                  className={`th cursor-pointer select-none hover:text-slate-900 ${table.columns[i].type === "number" ? "text-right" : ""}`}
                  onClick={() => setSort((s) => (s?.i === i ? (s.dir === 1 ? { i, dir: -1 } : null) : { i, dir: 1 }))}
                >
                  {table.columns[i].name}
                  {sort?.i === i ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(p * pageSize, (p + 1) * pageSize).map((r, n) => (
              <tr key={n} className="hover:bg-slate-50/70">
                {idx.map((i) => (
                  <td key={i} className={`td ${table.columns[i].type === "number" ? "text-right tabular-nums" : ""}`}>
                    {fmtCell(r[i], table.columns[i].type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2 text-sm text-slate-600">
          <button className="btn btn-ghost px-2.5 py-1" disabled={p === 0} onClick={() => setPage(p - 1)}>
            Anterior
          </button>
          <span>
            Página {p + 1} de {pages}
          </span>
          <button className="btn btn-ghost px-2.5 py-1" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
