"use client";

interface DemoTable {
  id: string;
  label: string;
  seats: number;
  status: "available" | "occupied";
  x: number; // percentage
  y: number; // percentage
  w: number;
  h: number;
  shape: "round" | "square";
}

const DEMO_TABLES: DemoTable[] = [
  { id: "t1", label: "1", seats: 2, status: "available", x: 6, y: 10, w: 16, h: 16, shape: "round" },
  { id: "t2", label: "2", seats: 2, status: "occupied", x: 6, y: 34, w: 16, h: 16, shape: "round" },
  { id: "t3", label: "3", seats: 4, status: "available", x: 6, y: 60, w: 20, h: 20, shape: "square" },
  { id: "t4", label: "4", seats: 4, status: "available", x: 32, y: 10, w: 20, h: 20, shape: "square" },
  { id: "t5", label: "5", seats: 4, status: "occupied", x: 32, y: 38, w: 20, h: 20, shape: "square" },
  { id: "t6", label: "6", seats: 6, status: "available", x: 30, y: 66, w: 24, h: 24, shape: "square" },
  { id: "t7", label: "7", seats: 2, status: "available", x: 62, y: 12, w: 16, h: 16, shape: "round" },
  { id: "t8", label: "8", seats: 2, status: "available", x: 62, y: 36, w: 16, h: 16, shape: "round" },
  { id: "t9", label: "9", seats: 4, status: "occupied", x: 62, y: 60, w: 20, h: 20, shape: "square" },
  { id: "t10", label: "10", seats: 6, status: "available", x: 84, y: 22, w: 15, h: 30, shape: "square" },
];

export function TableMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div
        className="relative w-full aspect-[16/10] overflow-hidden"
        style={{
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[3%] flex items-center justify-center text-[10px] uppercase tracking-widest"
          style={{ background: "var(--color-border)", color: "var(--color-muted)", writingMode: "vertical-rl" }}
        >
          Barra
        </div>

        {DEMO_TABLES.map((table) => {
          const isSelected = selected === table.id;
          const isOccupied = table.status === "occupied";
          return (
            <button
              key={table.id}
              type="button"
              disabled={isOccupied}
              onClick={() => onSelect(table.id)}
              aria-pressed={isSelected}
              aria-label={`Mesa ${table.label}, ${table.seats} personas, ${isOccupied ? "ocupada" : "disponible"}`}
              className="absolute flex flex-col items-center justify-center text-xs font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)] disabled:cursor-not-allowed"
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                width: `${table.w}%`,
                height: `${table.h}%`,
                borderRadius: table.shape === "round" ? "999px" : "var(--radius-sm)",
                background: isSelected
                  ? "var(--color-accent)"
                  : isOccupied
                    ? "var(--color-border)"
                    : "var(--color-surface)",
                color: isSelected ? "var(--color-background)" : isOccupied ? "var(--color-muted)" : "var(--color-primary)",
                border: `1.5px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                transform: isSelected ? "scale(1.06)" : "scale(1)",
              }}
            >
              <span className="font-display text-base leading-none">{table.label}</span>
              <span className="text-[10px] opacity-70 mt-1">{table.seats}p</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-5 mt-4 text-xs" style={{ color: "var(--color-muted)" }}>
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)" }}
          />
          Disponible
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--color-border)" }} />
          Ocupada
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--color-accent)" }} />
          Seleccionada
        </span>
      </div>
    </div>
  );
}
