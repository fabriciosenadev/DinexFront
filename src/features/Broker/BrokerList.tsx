import { useEffect, useState, useCallback } from "react";
import { getBrokers, deleteBroker, type BrokerDTO } from "./brokers.service";
import { notification } from "../../shared/services/notification";
import BrokerForm from "./BrokerForm";
import { maskCnpj } from "../../shared/utils/cnpjMask";
import { Pencil, Trash2, Link as LinkIcon } from "lucide-react";
import TableWrapper from "../../shared/components/layout/TableWrapper";

export default function BrokerList() {
    const [brokers, setBrokers] = useState<BrokerDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBroker, setEditBroker] = useState<BrokerDTO | null>(null);

    const fetchBrokers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getBrokers();
            setBrokers(data);
        } catch {
            notification.error("Erro ao carregar corretoras");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrokers();
    }, [fetchBrokers]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta corretora?")) return;
        try {
            await deleteBroker(id);
            notification.success("Corretora excluída!");
            fetchBrokers();
        } catch {
            notification.error("Erro ao excluir corretora");
        }
    };

    const normalizeUrl = (url?: string | null) => {
        if (!url) return "";
        if (/^https?:\/\//i.test(url)) return url;
        return `https://${url}`;
    };

    return (
        <>
            <BrokerForm
                onSuccess={fetchBrokers}
                broker={editBroker}
                onCancel={() => setEditBroker(null)}
            />

            {loading ? (
                <div className="text-center mt-8 text-white/80">Carregando...</div>
            ) : brokers.length === 0 ? (
                <div className="text-center text-white/60 py-6 bg-slate-800 rounded-xl">
                    Nenhuma corretora cadastrada.
                </div>
            ) : (
                <>
                    {/* MOBILE: cards empilhados */}
                    <ul className="sm:hidden space-y-3">
                        {brokers.map((b) => (
                            <li
                                key={b.id}
                                className="rounded-xl bg-slate-800 p-3 shadow border border-slate-700/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-white font-semibold">{b.name}</div>
                                        <div className="text-white/60 text-sm">{maskCnpj(b.cnpj)}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditBroker(b)}
                                            className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white"
                                            aria-label="Editar corretora"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                                            aria-label="Excluir corretora"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                                    <div className="rounded-lg bg-slate-900 px-3 py-2">
                                        <div className="text-white/50 text-xs">Website</div>
                                        {b.website ? (
                                            <a
                                                href={normalizeUrl(b.website)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                                            >
                                                <LinkIcon className="w-3.5 h-3.5" />
                                                {b.website}
                                            </a>
                                        ) : (
                                            <div className="text-white">-</div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* DESKTOP: tabela */}
                    <div className="hidden sm:block">
                        <TableWrapper>
                            <table className="w-full text-sm text-white">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-left whitespace-nowrap">Nome</th>
                                        <th className="p-3 text-left whitespace-nowrap">CNPJ</th>
                                        <th className="p-3 text-left whitespace-nowrap">Website</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brokers.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="border-t border-slate-700 hover:bg-slate-700/40"
                                        >
                                            <td className="p-3 whitespace-nowrap">{b.name}</td>
                                            <td className="p-3 whitespace-nowrap">{maskCnpj(b.cnpj)}</td>
                                            <td className="p-3 whitespace-nowrap">
                                                {b.website ? (
                                                    <a
                                                        className="text-blue-400 hover:underline"
                                                        href={normalizeUrl(b.website)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {b.website}
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setEditBroker(b)}
                                                        className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white font-medium"
                                                        aria-label="Editar corretora"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.id)}
                                                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-medium"
                                                        aria-label="Excluir corretora"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableWrapper>
                    </div>
                </>
            )}
        </>
    );
}
