type PerfPoint = { label: string; value: number };

export default function PerformanceCard({ data = [] as PerfPoint[] }) {
  const rows = data.length
    ? data
    : [
        { label: "YTD", value: 0 },
        { label: "1M", value: 0 },
        { label: "3M", value: 0 },
        { label: "12M", value: 0 },
      ];

  return (
    <div className="bg-slate-900 rounded-2xl p-4">
      <p className="text-slate-200 font-semibold">Performance</p>
      <div className="mt-3 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-white">
          <thead className="bg-slate-800/70">
            <tr>
              <th className="text-left p-3">Período</th>
              <th className="text-left p-3">Retorno</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-800">
                <td className="p-3 text-slate-300">{r.label}</td>
                <td className="p-3">{r.value.toLocaleString("pt-BR")}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
