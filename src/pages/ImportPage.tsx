// src/pages/ImportPage.tsx
import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";
import ImportForm from "../features/import/ImportForm";

export default function ImportPage() {
  return (
    <PageLayout variant="narrow">
      <PageHeader title="Importação" subtitle="Envie o .xlsx do extrato de negociações da B3" />
      <ImportForm />
    </PageLayout>
  );
}
