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
    console.log(_id, "Importação realizada com ID ");
  };

  return (
    <PageLayout>
      <PageSection>
        <PageHeader
          title="Importação"
          subtitle={
            <>
              <p>
                Envie o arquivo{" "}
                <strong>Extrato de Movimentação (.xlsx)</strong> exportado do
                CEI/B3.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                ✔ Esse arquivo contém suas movimentações: compras, vendas,
                proventos e transferências. <br />
                ✘ Não são aceitos: Extrato Consolidado, Posição de Ativos,
                Informe de Rendimentos ou Notas de Corretagem.
              </p>
            </>
          }
        />
      </PageSection>
      <PageSection>
        <div className="my-4 p-4 rounded-xl bg-blue-900/40 border border-blue-700 text-blue-200 text-sm">
          <strong>Status da funcionalidade:</strong> neste momento o sistema processa apenas 
          <strong> compras e vendas de ativos de renda variável (ações e FIIs)</strong>.
          <br />
          Proventos, subscrições, amortizações, direitos, eventos corporativos e 
          ativos de renda fixa serão suportados nas próximas versões.
        </div>
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
