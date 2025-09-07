// src/pages/Home.tsx
import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";

export default function Home() {
  return (
    <PageLayout variant="default">
      <PageHeader title="Dashboard" subtitle="Visão geral das suas carteiras e operações" />

      {/* Grid responsiva de cards (placeholders por enquanto) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* KPIs principais */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-400 text-sm">Patrimônio</p>
          <div className="h-8 mt-2 bg-slate-800/70 rounded" />
        </div>
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-400 text-sm">P/L do dia</p>
          <div className="h-8 mt-2 bg-slate-800/70 rounded" />
        </div>
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-400 text-sm">Aportes (30d)</p>
          <div className="h-8 mt-2 bg-slate-800/70 rounded" />
        </div>
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-400 text-sm">Dividendos (30d)</p>
          <div className="h-8 mt-2 bg-slate-800/70 rounded" />
        </div>

        {/* Alocação / Performance */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-200 font-semibold">Alocação por classe</p>
          <div className="h-40 mt-3 bg-slate-800/70 rounded" />
        </div>
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-200 font-semibold">Performance (YTD)</p>
          <div className="h-40 mt-3 bg-slate-800/70 rounded" />
        </div>

        {/* Últimas operações */}
        <div className="lg:col-span-12 bg-slate-900 rounded-2xl p-4">
          <p className="text-slate-200 font-semibold">Últimas operações</p>
          <div className="h-28 mt-3 bg-slate-800/70 rounded" />
        </div>
      </div>
    </PageLayout>
  );
}
