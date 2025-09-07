import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";
import BrokerList from "../features/Broker/BrokerList";

export default function BrokersPage() {
  return (
    <PageLayout variant="default">
      <PageHeader title="Corretoras" />
      <div className="w-full bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-6">
        <BrokerList />
      </div>
    </PageLayout>
  );
}
