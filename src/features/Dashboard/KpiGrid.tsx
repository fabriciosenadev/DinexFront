import type { ReactNode } from "react";

export type KpiItem = {
  label: string;
  value: string | number;
  hint?: string;
  right?: ReactNode; // ex: badge % ou ícone
};

export default function KpiGrid({ items = [] as KpiItem[] }) {
  const data = items.length
    ? items
    : [
        { label: "Patrimônio", value: "—" },
        { label: "P/L do dia", value: "—" },
        { label: "Aportes (30d)", value: "—" },
        { label: "Dividendos (30d)", value: "—" },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((k, i) => (
        <div key={i} className="bg-slate-900 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-slate-400 text-sm">{k.label}</p>
            {k.right ? <div className="text-xs">{k.right}</div> : null}
          </div>
          <div className="mt-2 text-white text-2xl font-semibold">{k.value}</div>
          {k.hint ? <p className="text-slate-500 text-xs mt-1">{k.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
