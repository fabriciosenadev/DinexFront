// src/features/import/ImportList.tsx
import { useEffect, useState } from "react";
import { getImportJobs, getImportErrors } from "./import.service";
import type { ImportJobDTO, ImportJobStatus } from "./import.model";
import type { ImportErrorDTO, PagedResult } from "./import.service";
import { ListChecks, PlayCircle, AlertTriangle, FileText, Calendar } from "lucide-react";
import TableWrapper from "../../shared/components/layout/TableWrapper";
import { ErrorsModal, type ErrorsState } from "./ImportErrorsModal";
import { formatIsoToLocal } from "./import.helpers";
import RowEditModal from "./ImportRowEditModal";



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

  const [rowEditOpen, setRowEditOpen] = useState(false);
  const [rowEditRowId, setRowEditRowId] = useState<string | null>(null);

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

  function closeErrors(): void {
    setErrorsModalOpen(false);
    setErrorsJob(null);
    setErrorsData(null);
    setErrorsLoadError(null);
  }

  async function fetchErrorsPage(jobId: string, page: number, pageSize: number) {
    setErrorsLoading(true);
    setErrorsLoadError(null);
    try {
      const data: PagedResult<ImportErrorDTO> = await getImportErrors(jobId, {
        page,
        pageSize,
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

  async function openErrors(job: ImportJobDTO): Promise<void> {
    setErrorsJob(job);
    setErrorsModalOpen(true);
    await fetchErrorsPage(job.id, 1, 10); // página inicial
  }

  // handlers que o modal chama
  const handleErrorsChangePage = async (page: number) => {
    if (!errorsJob || !errorsData) return;
    await fetchErrorsPage(errorsJob.id, page, errorsData.pageSize);
  };

  const handleErrorsChangePageSize = async (size: number) => {
    if (!errorsJob) return;
    await fetchErrorsPage(errorsJob.id, 1, size); // reset page
  };

  function openRowEdit(rowId?: string) {
    if (!errorsJob || !rowId) return;
    // fecha modal de erros e abre o de edição
    setErrorsModalOpen(false);
    setRowEditRowId(rowId);
    setRowEditOpen(true);
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
        <>
          {/* MOBILE: cards */}
          <ul className="sm:hidden space-y-3">
            {items.map((row) => {
              const total = row.totalRows ?? 0;
              const imported = row.importedRows ?? 0;
              const errorsCount = row.errorsCount ?? 0;
              const remainingValid = Math.max(0, total - imported - errorsCount);
              const canProcess =
                remainingValid > 0 && row.status !== "Processando" && processingId !== row.id;

              return (
                <li
                  key={row.id}
                  className="rounded-xl bg-slate-800 p-3 shadow border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-white font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-300" />
                        <span title={row.fileName} className="truncate max-w-[220px]">
                          {row.fileName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatIsoToLocal(row.uploadedAt)}</span>
                      </div>
                    </div>

                    <StatusPill value={row.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-900 px-3 py-2">
                      <div className="text-white/50 text-xs">Importadas</div>
                      <div className="text-white">{imported}/{total}</div>
                    </div>
                    <div className="rounded-lg bg-slate-900 px-3 py-2">
                      <div className="text-white/50 text-xs">Erros</div>
                      <div className="text-white">{errorsCount}</div>
                    </div>
                    <div className="rounded-lg bg-slate-900 px-3 py-2">
                      <div className="text-white/50 text-xs">Restantes</div>
                      <div className="text-white">{remainingValid}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col xs:flex-row gap-2">
                    <button
                      type="button"
                      disabled={!canProcess}
                      onClick={() => void handleProcessValid(row.id)}
                      className="inline-flex justify-center items-center gap-1 px-3 py-2 rounded-lg bg-green-600/80 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      title={canProcess ? "Processar todas as linhas válidas" : "Nada para processar"}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {processingId === row.id ? "Processando…" : "Processar válidas"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void openErrors(row)}
                      className="inline-flex justify-center items-center gap-1 px-3 py-2 rounded-lg bg-yellow-600/80 hover:bg-yellow-600 text-white"
                      title="Revisar inconsistências desta importação"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Revisar inconsistências
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* DESKTOP: tabela dentro do wrapper (rolagem só do wrapper) */}
          <div className="hidden sm:block">
            <TableWrapper>
              <table className="min-w-[980px] w-full text-sm">
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
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-600/80 hover:bg-yellow-600 text-white"
                              title="Revisar inconsistências desta importação"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              Revisar inconsistências
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableWrapper>
          </div>
        </>
      )}

      <ErrorsModal
        open={errorsModalOpen}
        onClose={closeErrors}
        job={errorsJob}
        loading={errorsLoading}
        loadError={errorsLoadError}
        data={errorsData}
        onChangePage={handleErrorsChangePage}
        onChangePageSize={handleErrorsChangePageSize}
        onOpenRowEdit={(rowId?: string) => openRowEdit(rowId)}
      />

      {errorsJob && rowEditRowId && (
        <RowEditModal
          importId={errorsJob.id}
          rowId={rowEditRowId}
          open={rowEditOpen}
          onClose={() => { setRowEditOpen(false); setRowEditRowId(null); }}
        />
      )}

    </div>
  );
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

