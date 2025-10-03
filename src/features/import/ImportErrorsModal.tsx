import TableWrapper from "../../shared/components/layout/TableWrapper";
import { formatIsoToLocal } from "./import.helpers";
import type { ImportErrorDTO, ImportJobDTO } from "./import.model";



export type ErrorsState = {
    page: number;
    pageSize: number;
    totalCount: number;
    items: ImportErrorDTO[];
};

export function ErrorsModal(props: {
    open: boolean;
    onClose: () => void;
    job: ImportJobDTO | null;
    loading: boolean;
    loadError: string | null;
    data: ErrorsState | null;
    onChangePage?: (page: number) => void;       // ← novo
    onChangePageSize?: (size: number) => void;   // ← novo
    onOpenRowEdit?: (id?: string) => void;
}) {
    const { open, onClose, job, loading, loadError, data, onChangePage, onChangePageSize, onOpenRowEdit } = props;
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

    function makeErrKey(er: ImportErrorDTO, idx: number) {
        // If backend later adds a real errorId, prefer it:
        const anyEr = er as unknown as { errorId?: string };
        if (anyEr.errorId) return anyEr.errorId;

        // Compose a stable key even when multiple errors share the same row id
        // Use fields that uniquely identify the message; include idx only as last fallback.
        return `${er.id}|${er.lineNumber}|${er.createdAt}|${(er.error ?? "").slice(0, 128)}|${idx}`;
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
                            {data.items.map((er, i) => (
                                <li
                                    key={makeErrKey(er, i)}
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
                                    <colgroup>{[
                                        <col key="c1" className="w-20" />,
                                        <col key="c2" />,
                                        <col key="c3" className="w-44" />,
                                        <col key="c4" className="w-52" />,
                                    ]}</colgroup>

                                    <thead>
                                        <tr className="text-left text-slate-300 bg-slate-800/50">
                                            <th className="py-2 px-3">Linha</th>
                                            <th className="py-2 px-3">Mensagem</th>
                                            <th className="py-2 px-3">Criado em</th>
                                            <th className="py-2 px-3">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.items.map((er, i) => (
                                            <tr key={makeErrKey(er, i)} className="border-t border-slate-800 text-slate-200 align-top">
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
                                                            title="Copiar mensagem  (quando disponível)"
                                                        >
                                                            Copiar mensagem
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onOpenRowEdit?.(er.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white"
                                                            title="Editar linha"
                                                        >
                                                            Editar linha
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

