import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";

export default function SettingsPage() {
  return (
    <PageLayout variant="default">
      <PageHeader title="Configurações" />
      <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-6 text-white/80">
        Aqui você poderá ajustar preferências do sistema.
      </div>
    </PageLayout>
  );
}
