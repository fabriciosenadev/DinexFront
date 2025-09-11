// src/features/import/ImportList.tsx
import { useEffect, useState } from "react";
import { getImportJobs, getImportErrors } from "./import.service";
import type { ImportJobDTO, ImportJobStatus } from "./import.model";
import type { ImportErrorDTO, PagedResult } from "./import.service";
import { ListChecks, PlayCircle, Bug } from "lucide-react";

type ErrorsState = {
  page: number;
  pageSize: number;
  totalCount: number;
  items: ImportErrorDTO[];
};

export default function ImportList() {
  const [items, setItems] = useState<ImportJobDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // modal de erros
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);
  const [errorsJob, setErrorsJob] = useState<ImportJobDTO | null>(null);
  const [errorsData, setErrorsData] = useState<ErrorsState | null>(null);
  const [errorsLoading, setErrorsLoading] = useState(false);
  const [errorsLoadError, setErrorsLoadError] = useState<string | null>(null);

  useEffect(() => {
    void reload();
  }, []);

  async function reload(): Promise<void> {
    try {
      setLoading(true);
      setError(null);
      const data = await getImportJobs();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  async function handleProcessValid(jobId: string): Promise<void> {
    try {
      setProcessingId(jobId);
      // TODO: processar válidas
      // await processImportJobValidRows(jobId);
      // await reload();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  }

  async function openErrors(job: ImportJobDTO): Promise<void> {
    setErrorsJob(job);
    setErrorsModalOpen(true);
    setErrorsLoadError(null);
    setErrorsData(null);
    setErrorsLoading(true);

    try {
      const data: PagedResult<ImportErrorDTO> = await getImportErrors(job.id, {
        page: 1,
        pageSize: 50,
        orderBy: "RowNumber",
        desc: false,
        includeRaw: false,
      });

      setErrorsData({
        page: data.page,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        items: data.items,
      });
    } catch (e) {
      setErrorsLoadError(e instanceof Error ? e.message : "Falha ao carregar erros");
    } finally {
      setErrorsLoading(false);
    }
  }

  function closeErrors(): void {
    setErrorsModalOpen(false);
    setErrorsJob(null);
    setErrorsData(null);
    setErrorsLoadError(null);
  }

  return (
    <div className="w-full bg-slate-900 shadow-md rounded-2xl px-4 py-6 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Importações já realizadas</h2>
      </div>

      {loading && <div className="text-slate-400">Carregando…</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="text-slate-400">Nenhuma importação encontrada.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-300">
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Arquivo</th>
                <th className="py-2 px-3">Enviado em</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Importadas</th>
                <th className="py-2 px-3">Erros</th>
                <th className="py-2 px-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const total = row.totalRows ?? 0;
                const imported = row.importedRows ?? 0;
                const errorsCount = row.errorsCount ?? 0;
                const remainingValid = Math.max(0, total - imported - errorsCount);
                const canProcess =
                  remainingValid > 0 && row.status !== "Processando" && processingId !== row.id;

                return (
                  <tr key={row.id} className="border-t border-slate-800 text-slate-200">
                    <td className="py-2 px-3 font-mono opacity-80">{row.id.slice(0, 8)}…</td>
                    <td className="py-2 px-3">
                      <span title={row.fileName} className="truncate inline-block max-w-[280px] align-bottom">
                        {row.fileName}
                      </span>
                    </td>
                    <td className="py-2 px-3">{formatIsoToLocal(row.uploadedAt)}</td>
                    <td className="py-2 px-3"><StatusPill value={row.status} /></td>
                    <td className="py-2 px-3">{imported}/{total}</td>
                    <td className="py-2 px-3">{errorsCount}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!canProcess}
                          onClick={() => void handleProcessValid(row.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600/80 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          title={canProcess ? "Processar todas as linhas válidas" : "Nada para processar"}
                        >
                          <PlayCircle className="w-4 h-4" />
                          {processingId === row.id ? "Processando…" : "Processar válidas"}
                        </button>

                        <button
                          type="button"
                          onClick={() => void openErrors(row)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white"
                          title="Ver erros desta importação"
                        >
                          <Bug className="w-4 h-4" />
                          Ver erros
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ErrorsModal
        open={errorsModalOpen}
        onClose={closeErrors}
        job={errorsJob}
        loading={errorsLoading}
        loadError={errorsLoadError}
        data={errorsData}
      />
    </div>
  );
}

function formatIsoToLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function StatusPill({ value }: { value: ImportJobStatus }) {
  const map: Record<ImportJobStatus, string> = {
    Pendente: "bg-yellow-600/30 text-yellow-300",
    Processando: "bg-blue-600/30 text-blue-300",
    Concluido: "bg-green-600/30 text-green-300",
    Falha: "bg-red-600/30 text-red-300",
  };
  const cls = map[value] ?? "bg-slate-600/30 text-slate-300";
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{value}</span>;
}

// ---------- Modal de erros ----------
function ErrorsModal(props: {
  open: boolean;
  onClose: () => void;
  job: ImportJobDTO | null;
  loading: boolean;
  loadError: string | null;
  data: ErrorsState | null;
}) {
  const { open, onClose, job, loading, loadError, data } = props;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog" aria-labelledby="errors-title" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id="errors-title" className="text-lg font-bold text-white">
            Erros da importação {job ? job.fileName : ""}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-white px-2 py-1 rounded" aria-label="Fechar">✕</button>
        </div>

        {loading && <div className="text-slate-400">Carregando erros…</div>}
        {loadError && <div className="text-red-400">{loadError}</div>}

        {!loading && !loadError && data && data.items.length === 0 && (
          <div className="text-slate-400">Nenhum erro encontrado.</div>
        )}

        {!loading && !loadError && data && data.items.length > 0 && (
          <>
            <div className="max-h-[60vh] overflow-auto rounded-lg border border-slate-800">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-300 bg-slate-800/50">
                    <th className="py-2 px-3 w-20">Linha</th>
                    <th className="py-2 px-3">Mensagem</th>
                    <th className="py-2 px-3 w-[45%]">Conteúdo bruto</th>
                    <th className="py-2 px-3 w-44">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((er) => (
                    <tr key={er.id} className="border-t border-slate-800 text-slate-200 align-top">
                      <td className="py-2 px-3 font-mono">{er.lineNumber}</td>
                      <td className="py-2 px-3">{er.error}</td>
                      <td className="py-2 px-3">
                        <pre className="whitespace-pre-wrap break-words text-xs text-slate-300">
                          {er.rawLineJson ?? "—"}
                        </pre>
                      </td>
                      <td className="py-2 px-3">{formatIsoToLocal(er.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-slate-400 text-sm">
              Total de erros: <span className="text-white font-semibold">{data.totalCount}</span>
            </div>
          </>
        )}

        <div className="mt-4 text-right">
          <button type="button" onClick={onClose} className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
