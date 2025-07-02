import { useEffect, useState } from "react";
import { getBrokers, deleteBroker, type BrokerDTO } from "./brokers.service";
import { notification } from "../../shared/services/notification";
import BrokerForm from "./BrokerForm";
import { maskCnpj } from "../../shared/utils/cnpjMask";
import { Pencil, Trash2 } from "lucide-react";

export default function BrokerList() {
    const [brokers, setBrokers] = useState<BrokerDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBroker, setEditBroker] = useState<BrokerDTO | null>(null);

    const fetchBrokers = async () => {
        setLoading(true);
        try {
            const data = await getBrokers();
            setBrokers(data);
        } catch {
            notification.error("Erro ao carregar corretoras");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrokers();
    }, []);

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

    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-16 px-2">
            <div className="w-full max-w-md sm:max-w-3xl bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-8">
                <h2 className="text-3xl font-bold mb-6 text-white text-center">
                    Corretoras
                </h2>
                <BrokerForm onSuccess={fetchBrokers} broker={editBroker} onCancel={() => setEditBroker(null)} />
                {loading ? (
                    <div className="text-center mt-8 text-white/80">Carregando...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm bg-slate-800 text-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left">Nome</th>
                                    <th className="p-3 text-left">CNPJ</th>
                                    <th className="p-3 text-left">Website</th>
                                    <th className="p-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brokers.map((b) => (
                                    <tr key={b.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                        <td className="p-3 whitespace-nowrap">{b.name}</td>
                                        <td className="p-3 whitespace-nowrap">{maskCnpj(b.cnpj)}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            {b.website
                                                ? <a className="text-blue-400 hover:underline" href={b.website} target="_blank" rel="noopener noreferrer">{b.website}</a>
                                                : "-"}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => setEditBroker(b)}
                                                className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white font-medium flex items-center gap-1"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(b.id)}
                                                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-medium flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {brokers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-white/60 py-6">
                                            Nenhuma corretora cadastrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
