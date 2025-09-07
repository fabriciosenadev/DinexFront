type Allocation = { label: string; percent: number };

export default function AllocationCard({ data = [] as Allocation[] }) {
  const items = data.length
    ? data
    : [
        { label: "Ações", percent: 40 },
        { label: "FIIs", percent: 25 },
        { label: "ETFs", percent: 20 },
        { label: "Renda Fixa", percent: 15 },
      ];

  return (
    <div className="bg-slate-900 rounded-2xl p-4">
      <p className="text-slate-200 font-semibold">Alocação por classe</p>
      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{it.label}</span>
              <span className="text-slate-400">{it.percent}%</span>
            </div>
            <div className="h-2 rounded bg-slate-800 mt-1">
              <div
                className="h-2 rounded bg-slate-600"
                style={{ width: `${Math.max(0, Math.min(100, it.percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
