// src/features/import/ImportRowEditModal.tsx
import { useEffect, useRef, useState } from "react";
import { getImportRowForEdit, type ImportRowForEditDTO } from "./import.service";

export default function RowEditModal({
    importId,
    rowId,
    open,
    onClose,
}: {
    importId: string;
    rowId: string;
    open: boolean;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [dto, setDto] = useState<ImportRowForEditDTO | null>(null);

    // guarda última key requisitada para evitar chamadas redundantes
    const fetchedRef = useRef<string | null>(null);
    // garante que só a última resposta atualize o state
    const reqIdRef = useRef(0);

    useEffect(() => {
        if (!open || !rowId) return;

        const key = `${importId}:${rowId}`;
        if (fetchedRef.current === key) return; // evita repetir mesma combinação
        fetchedRef.current = key;

        const myReqId = ++reqIdRef.current;
        let active = true;

        setLoading(true);
        setErr(null);
        setDto(null);

        getImportRowForEdit(importId, rowId)
            .then((resp: ImportRowForEditDTO) => {
                if (!active || reqIdRef.current !== myReqId) return;
                if (!resp) throw new Error("Resposta inválida.");
                setDto(resp);
            })
            .catch((e: unknown) => {
                if (!active || reqIdRef.current !== myReqId) return;
                setErr(e instanceof Error ? e.message : "Falha ao carregar a linha");
            })
            .finally(() => {
                if (!active || reqIdRef.current !== myReqId) return;
                setLoading(false);
            });

        return () => {
            // IMPORTANTE: libera o guard para o 2º passe do StrictMode refazer o fetch
            active = false;
            fetchedRef.current = null;
        };
    }, [open, importId, rowId]);

    if (!open) return null;

    const toLocalInput = (iso?: string | null): string => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        const p = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
    };

    const errorLines = (dto?.error ?? "")
        .split(/\s*\|\s*/g)
        .map(s => s.trim())
        .filter(Boolean);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-bold text-white">Editar Linha #{dto?.rowNumber ?? "…"}</h3>
                    <button className="text-slate-300 hover:text-white px-2 py-1 rounded" onClick={onClose}>✕</button>
                </div>

                {loading && <div className="text-slate-400">Carregando…</div>}
                {err && (
                    <div className="mb-3 rounded border border-red-500/30 bg-red-900/20 p-3 text-red-200 whitespace-pre-wrap">
                        {err}
                    </div>
                )}

                {!!errorLines.length && (
                    <div className="mb-3 rounded border border-yellow-500/30 bg-yellow-900/20 p-3 text-yellow-100">
                        {errorLines.map((line, i) => (<div key={i}>• {line}</div>))}
                    </div>
                )}

                {dto && (
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        {/* ... seus campos exatamente como estão ... */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Ativo" value={dto.asset} />
                            <Field label="Tipo de Operação" value={dto.operationType} />
                            <Field label="Movimento" value={dto.movement} />
                            <Field label="Data">
                                <input
                                    type="datetime-local"
                                    className="rounded border border-slate-700 bg-slate-800 text-white px-3 py-2"
                                    readOnly
                                    value={toLocalInput(dto.date)}
                                />
                            </Field>
                            <Field label="Vencimento" value={dto.dueDate} />
                            <Field label="Quantidade" value={dto.quantity?.toString() ?? ""} />
                            <Field label="Preço Unitário" value={dto.unitPrice?.toString() ?? ""} />
                            <Field label="Valor Total" value={dto.totalValue?.toString() ?? ""} />
                            <Field label="Corretora" value={dto.broker} />
                            <Field label="Status" value={dto.status} />

                            {!!dto.rawLineJson && (
                                <div className="col-span-2">
                                    <details>
                                        <summary className="cursor-pointer text-xs text-slate-400">Raw JSON</summary>
                                        <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-800 p-2 text-xs text-slate-200">
                                            {dto.rawLineJson}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 text-right">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                                onClick={onClose}
                            >
                                Fechar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function Field({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-400">{label}</span>
            {children ?? (
                <input
                    className="rounded border border-slate-700 bg-slate-800 text-white px-3 py-2"
                    readOnly
                    value={value ?? ""}
                />
            )}
        </label>
    );
}

