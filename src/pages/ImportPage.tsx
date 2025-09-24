// src/pages/ImportPage.tsx
import PageLayout from "../shared/components/layout/PageLayout";
import PageSection from "../shared/components/layout/PageSection";
import PageHeader from "../shared/components/layout/PageHeader";
import ImportForm from "../features/import/ImportForm";
import ImportList from "../features/import/ImportList";

export default function ImportPage() {
  return (
    <PageLayout>
      <PageSection>
        <PageHeader
          title="Importação"
          subtitle="Envie o .xlsx do extrato de negociações da B3."
          /* 🔹 sem className aqui */
        />
      </PageSection>

      <PageSection variant="narrow">
        <ImportForm />
      </PageSection>

      <PageSection variant="wide" className="mt-8">
        <ImportList />
      </PageSection>
    </PageLayout>
  );
}

