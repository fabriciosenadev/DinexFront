// src/pages/ImportPage.tsx
import { useState } from "react";
import PageLayout from "../shared/components/layout/PageLayout";
import PageSection from "../shared/components/layout/PageSection";
import PageHeader from "../shared/components/layout/PageHeader";
import ImportForm from "../features/import/ImportForm";
import ImportList from "../features/import/ImportList";

export default function ImportPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImported = (_id: string) => {
    setRefreshKey((v) => v + 1); // sinaliza reload para a lista
    console.log(_id, 'Importação realizada com ID ');    
  };

  return (
    <PageLayout>
      <PageSection>
        <PageHeader
          title="Importação"
          subtitle="Envie o .xlsx do extrato de negociações da B3."
        />
      </PageSection>

      <PageSection variant="narrow">
        <ImportForm onSuccess={handleImported} />
      </PageSection>

      <PageSection variant="wide" className="mt-8">
        <ImportList refreshKey={refreshKey} />
      </PageSection>
    </PageLayout>
  );
}
