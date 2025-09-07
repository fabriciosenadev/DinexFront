import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";
import ImportForm from "../features/import/ImportForm";
import ImportList from "../features/import/ImportList";

export default function ImportPage() {
  return (
    <PageLayout variant="wide">
      <PageHeader title="Importação" subtitle="Envie o .xlsx do extrato de negociações da B3" />
      <ImportForm />
      <div className="mt-8">
        <ImportList />
      </div>
    </PageLayout>
  );
}
