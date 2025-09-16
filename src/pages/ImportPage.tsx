import PageLayout from "../shared/components/layout/PageLayout";
import PageSection from "../shared/components/layout/PageSection";
import ImportForm from "../features/import/ImportForm";
import ImportList from "../features/import/ImportList";
import PageHeader from "../shared/components/layout/PageHeader";

export default function ImportPage() {
  return (
    <PageLayout variant="wide">
      <PageHeader
        title="Importação"
        subtitle="Envie o .xlsx do extrato de negociações da B3."
        // actions={<div>/* se quiser botões no header depois */</div>}
      />

      <PageSection variant="narrow">
        <ImportForm />
      </PageSection>

      <PageSection variant="wide" className="mt-8">
        <ImportList />
      </PageSection>
    </PageLayout>
  );
}
