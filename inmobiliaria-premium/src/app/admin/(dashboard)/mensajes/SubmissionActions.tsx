"use client";

import { useTransition } from "react";
import { updateSubmissionStatus } from "./actions";

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  closed: "Cerrado",
};

export function SubmissionActions({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateSubmissionStatus(id, e.target.value as "new" | "contacted" | "closed"))}
      className="border-b border-line bg-transparent py-1 pr-6 text-[0.78rem] uppercase tracking-[0.08em] text-ink outline-none focus:border-ink"
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
