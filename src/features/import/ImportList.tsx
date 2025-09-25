// src/features/import/ImportList.tsx
import { useEffect, useState } from "react";
import { getImportJobs, getImportErrors } from "./import.service";
import type { ImportJobDTO, ImportJobStatus } from "./import.model";
import type { ImportErrorDTO, PagedResult } from "./import.service";
import { ListChecks, PlayCircle, AlertTriangle, FileText, Calendar } from "lucide-react";
import TableWrapper from "../../shared/components/layout/TableWrapper";

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

  // async function openErrors(job: ImportJobDTO): Promise<void> {
  //   setErrorsJob(job);
  //   setErrorsModalOpen(true);
  //   setErrorsLoadError(null);
  //   setErrorsData(null);
  //   setErrorsLoading(true);

  //   try {
  //     const data: PagedResult<ImportErrorDTO> = await getImportErrors(job.id, {
  //       page: 1,
  //       pageSize: 50,
  //       orderBy: "RowNumber",
  //       desc: false,
  //       includeRaw: false,
  //     });

  //     setErrorsData({
  //       page: data.page,
  //       pageSize: data.pageSize,
  //       totalCount: data.totalCount,
  //       items: data.items,
  //     });
  //   } catch (e) {
  //     setErrorsLoadError(e instanceof Error ? e.message : "Falha ao carregar erros");
  //   } finally {
  //     setErrorsLoading(false);
  //   }
  // }

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
// ---------- Modal de erros ----------
function ErrorsModal(props: {
  open: boolean;
  onClose: () => void;
  job: ImportJobDTO | null;
  loading: boolean;
  loadError: string | null;
  data: ErrorsState | null;
  onChangePage?: (page: number) => void;       // ← novo
  onChangePageSize?: (size: number) => void;   // ← novo
}) {
  const { open, onClose, job, loading, loadError, data, onChangePage, onChangePageSize } = props;
  if (!open) return null;

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Não foi possível copiar para a área de transferência.");
    }
  }

  async function handleViewRaw(errorId: string) {
    console.log("Ver conteúdo bruto do erro", errorId);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="errors-title"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <h3 id="errors-title" className="text-lg font-bold text-white">
              Inconsistências de Validação na Importação {job ? job.fileName : ""}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white px-2 py-1 rounded"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <p className="mt-1 text-slate-400 text-sm">
            Essas inconsistências foram identificadas pela validação automática e{" "}
            <span className="text-slate-300">podem não representar erros definitivos</span>.
            Revise antes de corrigir ou reprocessar.
          </p>
        </div>

        {loading && <div className="text-slate-400">Carregando inconsistências…</div>}
        {loadError && <div className="text-red-400">{loadError}</div>}

        {!loading && !loadError && data && data.items.length === 0 && (
          <div className="text-slate-400">Nenhuma inconsistência encontrada.</div>
        )}

        {!loading && !loadError && data && data.items.length > 0 && (
          <>
            {/* MOBILE: cards */}
            <ul className="sm:hidden space-y-3 max-h-[60vh] overflow-auto pr-1">
              {data.items.map((er) => (
                <li
                  key={er.id}
                  className="rounded-xl bg-slate-800 p-3 shadow border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">Linha</div>
                      <div className="text-white font-mono">{er.lineNumber}</div>
                    </div>
                    <div className="text-xs text-slate-400">{formatIsoToLocal(er.createdAt)}</div>
                  </div>

                  <div className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-sm">
                    <div className="text-white/50 text-xs mb-1">Mensagem</div>
                    <div className="text-slate-100">{er.error}</div>
                  </div>

                  <div className="mt-3 flex flex-col xs:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopy(er.error)}
                      className="inline-flex justify-center items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                      title="Copiar mensagem"
                    >
                      Copiar mensagem
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleViewRaw(er.id)}
                      className="inline-flex justify-center items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/70 hover:bg-slate-600 text-white"
                      title="Ver conteúdo bruto (quando disponível)"
                    >
                      Ver conteúdo
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* DESKTOP: tabela com rolagem só no wrapper (sem barra horizontal) */}
            <div className="hidden sm:block">
              <TableWrapper className="max-h-[60vh] rounded-lg border border-slate-800 overflow-x-hidden">
                <table className="w-full table-fixed text-sm">
                  {/* Larguras previsíveis por coluna */}
                  <colgroup>
                    <col className="w-20" />   {/* Linha */}
                    <col />                    {/* Mensagem (flexível) */}
                    <col className="w-44" />   {/* Criado em */}
                    <col className="w-52" />   {/* Ações */}
                  </colgroup>

                  <thead>
                    <tr className="text-left text-slate-300 bg-slate-800/50">
                      <th className="py-2 px-3">Linha</th>
                      <th className="py-2 px-3">Mensagem</th>
                      <th className="py-2 px-3">Criado em</th>
                      <th className="py-2 px-3">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.items.map((er) => (
                      <tr key={er.id} className="border-t border-slate-800 text-slate-200 align-top">
                        <td className="py-2 px-3 font-mono">{er.lineNumber}</td>

                        {/* quebra de linha para evitar overflow */}
                        <td className="py-2 px-3 whitespace-normal break-words">
                          {er.error}
                        </td>

                        <td className="py-2 px-3">{formatIsoToLocal(er.createdAt)}</td>
                        <td className="py-2 px-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void handleCopy(er.error)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                              title="Copiar mensagem"
                            >
                              Copiar mensagem
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleViewRaw(er.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700/70 hover:bg-slate-600 text-white"
                              title="Ver conteúdo bruto (quando disponível)"
                            >
                              Ver conteúdo
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
            </div>


            {/* paginação do modal */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* page size */}
              <div className="flex justify-center sm:justify-start">
                <select
                  disabled={loading || !data}
                  value={data?.pageSize ?? 50}
                  onChange={(e) => onChangePageSize?.(Number(e.target.value))}
                  className="bg-slate-700 text-white px-2 py-1 rounded"
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>{n} por página</option>
                  ))}
                </select>
              </div>

              {/* pager */}
              <div className="flex justify-center sm:justify-end items-center gap-2 flex-wrap">
                <button
                  className="px-3 py-1 bg-slate-700 rounded text-white disabled:opacity-50"
                  disabled={loading || !data || data.page <= 1}
                  onClick={() => data && onChangePage?.(data.page - 1)}
                >
                  Anterior
                </button>
                <span className="px-2 py-1 text-white font-semibold">{data?.page ?? 1}</span>
                <button
                  className="px-3 py-1 bg-slate-700 rounded text-white disabled:opacity-50"
                  disabled={loading || !data || data.page * data.pageSize >= data.totalCount}
                  onClick={() => data && onChangePage?.(data.page + 1)}
                >
                  Próxima
                </button>

                {data && (
                  <span className="text-slate-300 ml-2 whitespace-nowrap text-sm">
                    {`Exibindo ${(data.page - 1) * data.pageSize + 1}-${Math.min(
                      data.page * data.pageSize,
                      data.totalCount
                    )} de ${data.totalCount}`}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

