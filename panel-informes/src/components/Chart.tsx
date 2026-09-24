import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell as PieCell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { ChartSpec, TableData } from "../../shared/types.ts";
import { groupForChart } from "../../shared/engine.ts";
import { fmt, fmtLabel, PALETTE } from "../format.ts";

interface Props {
  spec: ChartSpec;
  table: TableData;
  height?: number;
  onSelect?: (dimension: string, value: string) => void;
  selected?: string[];
}

export function ChartView({ spec, table, height = 260, onSelect, selected = [] }: Props) {
  const data = useMemo(
    () => groupForChart(table, spec.dimension, spec.grain, spec.measure, spec.type === "line" ? 0 : spec.topN || 10),
    [table, spec],
  );
  const isDate = table.columns.find((c) => c.name === spec.dimension)?.type === "date";
  // En gráficos de fecha el valor agrupado (mes/año) no es un valor de la columna: no se puede filtrar con clic
  const click = (name: string) => {
    if (!onSelect || isDate || name === "Otros") return;
    onSelect(spec.dimension, name);
  };
  const tip = (v: unknown) => fmt(Number(v), spec.format);
  const tick = (v: unknown) => fmt(Number(v), spec.format, true);
  const dim = (id: string) => (selected.length && !selected.includes(id) ? 0.35 : 1);

  if (!data.length) return <div className="grid place-items-center text-sm text-slate-400" style={{ height }}>Sin datos con estos filtros</div>;

  if (spec.type === "table") {
    return (
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">{spec.dimension}</th>
              <th className="th text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name} onClick={() => click(d.name)} className={onSelect && !isDate ? "cursor-pointer hover:bg-slate-50" : ""}>
                <td className="td">{fmtLabel(d.name)}</td>
                <td className="td text-right tabular-nums">{fmt(d.value, spec.format)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {spec.type === "line" ? (
          <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="#eef0f4" vertical={false} />
            <XAxis dataKey="name" tickFormatter={fmtLabel} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} minTickGap={16} />
            <YAxis tickFormatter={tick} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={64} />
            <Tooltip formatter={tip} labelFormatter={(l) => fmtLabel(String(l))} />
            <Line type="monotone" dataKey="value" name={spec.title} stroke={PALETTE[0]} strokeWidth={2.5} dot={data.length < 40} />
          </LineChart>
        ) : spec.type === "pie" ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="82%" paddingAngle={1.5} onClick={(d: any) => click(String(d.name))}>
              {data.map((d, i) => (
                <PieCell key={d.name} fill={PALETTE[i % PALETTE.length]} fillOpacity={dim(d.name)} className={onSelect ? "cursor-pointer" : ""} />
              ))}
            </Pie>
            <Tooltip formatter={tip} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        ) : spec.type === "hbar" ? (
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="#eef0f4" horizontal={false} />
            <XAxis type="number" tickFormatter={tick} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: "#334155" }} tickLine={false} axisLine={false} tickFormatter={(v) => truncate(fmtLabel(String(v)), 20)} />
            <Tooltip formatter={tip} cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="value" name={spec.title} radius={[0, 4, 4, 0]} onClick={(d: any) => click(String(d.name))}>
              {data.map((d) => (
                <PieCell key={d.name} fill={PALETTE[0]} fillOpacity={dim(d.name)} className={onSelect ? "cursor-pointer" : ""} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="#eef0f4" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v) => truncate(fmtLabel(String(v)), 14)} interval={0} />
            <YAxis tickFormatter={tick} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={64} />
            <Tooltip formatter={tip} cursor={{ fill: "#f1f5f9" }} labelFormatter={(l) => fmtLabel(String(l))} />
            <Bar dataKey="value" name={spec.title} radius={[4, 4, 0, 0]} onClick={(d: any) => click(String(d.name))}>
              {data.map((d) => (
                <PieCell key={d.name} fill={PALETTE[0]} fillOpacity={dim(d.name)} className={onSelect && !isDate ? "cursor-pointer" : ""} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
